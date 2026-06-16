import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { createSession } from './create_session.js'
import createTicket from './generate_ticket.js'
import printService, { buildReceipt, sendToPrinter } from './print_service.js'
import notifications from './notifications.js'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/session', async (req, res) => {
  try {
    const data = req.body || {}
    const session = await createSession(data, 300)
    res.json(session)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/ticket', async (req, res) => {
  try {
    const { name, phone, services, mode } = req.body
    const result = await createTicket({ name, phone, services, mode })
    res.json(result)

    // send registration WhatsApp message
    try {
      const msg = `تم تسجيلك في الدور ${result.ticket}\nسوف يتم تنبيهك عند قرب دورك` + (result.expectedMinutes ? `\nالوقت المتوقع: ${result.expectedMinutes} دقيقة` : '')
      await notifications.sendWhatsApp(result.customer.phone, msg)
    } catch (e) {
      console.error('Failed to send registration WhatsApp', e)
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// List queue (waiting and serving)
app.get('/api/queue', async (req, res) => {
  try {
    const { data: rows, error } = await (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
      .from('queue')
      .select('*')
      .in('status', ['waiting', 'serving'])
      .order('created_at', { ascending: true })

    if (error) throw error

    // enrich with visit and customer
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const detailed = []
    for (const r of rows) {
      const { data: visit } = await supabase.from('visits').select('*').eq('id', r.visit_id).maybeSingle()
      let customer = null
      if (visit?.customer_id) {
        const { data: c } = await supabase.from('customers').select('*').eq('id', visit.customer_id).maybeSingle()
        customer = c
      }
      detailed.push({ ...r, visit, customer })
    }

    res.json(detailed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Start serving a queue item
app.post('/api/queue/:id/start', async (req, res) => {
  try {
    const id = req.params.id
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: updated, error } = await supabase.from('queue').update({ status: 'serving' }).eq('id', id).select('*').maybeSingle()
    if (error) throw error
    await supabase.from('visits').update({ status: 'serving' }).eq('id', updated.visit_id)
    // set queue started_at
    await supabase.from('queue').update({ started_at: new Date().toISOString() }).eq('id', id)
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Complete a queue item
app.post('/api/queue/:id/complete', async (req, res) => {
  try {
    const id = req.params.id
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: updated, error } = await supabase.from('queue').update({ status: 'completed' }).eq('id', id).select('*').maybeSingle()
    if (error) throw error
    await supabase.from('visits').update({ status: 'completed' }).eq('id', updated.visit_id)
    // set queue completed_at
    await supabase.from('queue').update({ completed_at: new Date().toISOString() }).eq('id', id)
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Services CRUD
app.get('/api/services', async (req, res) => {
  try {
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data, error } = await supabase.from('services').select('*').order('category', { ascending: true }).order('name', { ascending: true })
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/services', async (req, res) => {
  try {
    const payload = req.body
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data, error } = await supabase.from('services').insert(payload).select('*').maybeSingle()
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Attach services to a visit (adds service objects to visits.services array)
app.post('/api/visits/:id/services', async (req, res) => {
  try {
    const visitId = req.params.id
    const { service_ids } = req.body
    if (!Array.isArray(service_ids) || service_ids.length === 0) return res.status(400).json({ error: 'service_ids required' })
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    // fetch service details
    const { data: services } = await supabase.from('services').select('*').in('id', service_ids)

    const toAdd = services.map(s => ({
      id: (await import('crypto')).randomUUID(),
      service_id: s.id,
      name: s.name,
      price: s.price,
      duration_minutes: s.duration_minutes,
      tips: s.tips,
      status: 'waiting',
      created_at: new Date().toISOString()
    }))

    // append to existing services array
    const { data: visit, error: getErr } = await supabase.from('visits').select('services').eq('id', visitId).maybeSingle()
    if (getErr) throw getErr
    const existing = visit?.services || []
    const updatedServices = existing.concat(toAdd)

    const { data: updated, error: updateErr } = await supabase.from('visits').update({ services: updatedServices }).eq('id', visitId).select('*').maybeSingle()
    if (updateErr) throw updateErr

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Statistics endpoints
app.get('/api/stats/overview', async (req, res) => {
  try {
    const { start, end } = req.query
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    // fetch queues in range
    let q = supabase.from('queue').select('*')
    if (start) q = q.gte('created_at', start)
    if (end) q = q.lte('created_at', end)
    const { data: queues, error: qErr } = await q
    if (qErr) throw qErr

    // for each queue get visit and its services
    const visits = []
    for (const item of queues) {
      const { data: visit } = await supabase.from('visits').select('*').eq('id', item.visit_id).maybeSingle()
      visits.push({ queue: item, visit })
    }

    // compute stats
    const waitTimes = []
    const serviceDurations = []
    const perEmployee = {}

    for (const v of visits) {
      const queueCreated = new Date(v.queue.created_at)
      const services = v.visit?.services || []
      // first started among services
      const startedTimes = services.map(s => s.started_at ? new Date(s.started_at) : null).filter(Boolean)
      if (startedTimes.length > 0) {
        const firstStarted = new Date(Math.min(...startedTimes))
        waitTimes.push((firstStarted - queueCreated) / 1000)
      }
      for (const s of services) {
        if (s.started_at && s.completed_at) {
          const dur = (new Date(s.completed_at) - new Date(s.started_at)) / 1000
          serviceDurations.push(dur)
          // find employee from service_logs
          const { data: logs } = await supabase.from('service_logs').select('*').eq('service_instance_id', s.id).maybeSingle()
          const emp = logs?.employee_id || null
          if (emp) {
            if (!perEmployee[emp]) perEmployee[emp] = { completed: 0, totalSeconds: 0 }
            perEmployee[emp].completed += 1
            perEmployee[emp].totalSeconds += dur
          }
        }
      }
    }

    const avgWait = waitTimes.length ? waitTimes.reduce((a,b)=>a+b,0)/waitTimes.length : 0
    const avgService = serviceDurations.length ? serviceDurations.reduce((a,b)=>a+b,0)/serviceDurations.length : 0

    // convert perEmployee ids to names
    const employeesStats = []
    for (const [empId, val] of Object.entries(perEmployee)) {
      const { data: emp } = await supabase.from('employees').select('*').eq('id', empId).maybeSingle()
      employeesStats.push({ employee_id: empId, name: emp?.name || 'غير معرف', completed: val.completed, avg_service_seconds: val.totalSeconds/val.completed })
    }

    res.json({ avg_wait_seconds: avgWait, avg_service_seconds: avgService, employees: employeesStats })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Track ticket by phone or ticket code
app.get('/api/track', async (req, res) => {
  try {
    const { phone, ticket } = req.query
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    let queueRow = null
    if (ticket) {
      const { data } = await supabase.from('queue').select('*').eq('ticket_code', ticket).maybeSingle()
      queueRow = data
    } else if (phone) {
      const { data: customer } = await supabase.from('customers').select('*').eq('phone', phone).maybeSingle()
      if (!customer) return res.status(404).json({ error: 'customer not found' })
      const { data: visit } = await supabase.from('visits').select('*').eq('customer_id', customer.id).order('created_at', { ascending: false }).limit(1).maybeSingle()
      if (!visit) return res.status(404).json({ error: 'visit not found' })
      const { data: q } = await supabase.from('queue').select('*').eq('visit_id', visit.id).maybeSingle()
      queueRow = q
    } else {
      return res.status(400).json({ error: 'phone or ticket required' })
    }

    if (!queueRow) return res.status(404).json({ error: 'ticket not found' })

    // compute people ahead
    const { data: ahead } = await supabase.from('queue').select('*').eq('status', 'waiting').lt('created_at', queueRow.created_at)
    const peopleAhead = (ahead || []).length

    // estimate expected minutes: sum durations of services ahead / chairs
    const chairs = Number(process.env.CHAIRS || 1)
    let totalSeconds = 0
    for (const q of ahead || []) {
      const { data: v } = await supabase.from('visits').select('services').eq('id', q.visit_id).maybeSingle()
      const services = v?.services || []
      for (const s of services) {
        totalSeconds += Number(s.duration_minutes || 0) * 60
      }
    }
    const expectedMinutes = chairs > 0 ? Math.ceil((totalSeconds / chairs) / 60) : null

    // get visit and customer
    const { data: visitRow } = await supabase.from('visits').select('*').eq('id', queueRow.visit_id).maybeSingle()
    const { data: customerRow } = visitRow ? await supabase.from('customers').select('*').eq('id', visitRow.customer_id).maybeSingle() : { data: null }

    res.json({ ticket: queueRow.ticket_code, status: queueRow.status, peopleAhead, expectedMinutes, visit: visitRow, customer: customerRow })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Create shareable tracking link for a visit
app.post('/api/share', async (req, res) => {
  try {
    const { visit_id, ttl_hours } = req.body
    if (!visit_id) return res.status(400).json({ error: 'visit_id required' })
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    // try to get ticket
    const { data: ticketRow } = await supabase.from('queue').select('*').eq('visit_id', visit_id).maybeSingle()
    const ticketCode = ticketRow?.ticket_code || null
    const ttl = (Number(ttl_hours) || 24) * 3600
    const session = await createSession({ visit_id, ticket: ticketCode }, ttl)
    // adjust link to tracking page
    const link = session.link.replace('/form', '/track')
    res.json({ link, ticket: ticketCode })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Create review session link for a visit
app.post('/api/review/link', async (req, res) => {
  try {
    const { visit_id, ttl_hours } = req.body
    if (!visit_id) return res.status(400).json({ error: 'visit_id required' })
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

    const { data: existingReview } = await supabase.from('reviews').select('*').eq('visit_id', visit_id).maybeSingle()
    if (existingReview) return res.status(409).json({ error: 'review already submitted for this visit' })

    const { data: ticketRow } = await supabase.from('queue').select('*').eq('visit_id', visit_id).maybeSingle()
    const ticketCode = ticketRow?.ticket_code || null
    const ttl = (Number(ttl_hours) || 72) * 3600
    const session = await createSession({ visit_id, ticket: ticketCode, type: 'review' }, ttl, '/review')
    res.json({ link: session.link, ticket: ticketCode })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Submit a review via session link
app.post('/api/reviews', async (req, res) => {
  try {
    const { session_code, rating, comment } = req.body
    if (!session_code || !rating) return res.status(400).json({ error: 'session_code and rating are required' })
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: session } = await supabase.from('sessions').select('*').eq('session_code', session_code).maybeSingle()
    if (!session) return res.status(404).json({ error: 'invalid session' })
    if (new Date(session.expires_at) < new Date()) return res.status(410).json({ error: 'session expired' })
    if (session.data?.type !== 'review') return res.status(400).json({ error: 'invalid review session' })
    const visit_id = session.data.visit_id

    // prevent duplicate review
    const { data: existingReview } = await supabase.from('reviews').select('*').eq('visit_id', visit_id).maybeSingle()
    if (existingReview) return res.status(409).json({ error: 'review already submitted' })

    const { data: review, error } = await supabase.from('reviews').insert({ visit_id, rating, comment }).select('*').maybeSingle()
    if (error) throw error
    res.json(review)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Get review session details
app.get('/api/review-session', async (req, res) => {
  try {
    const { session_code } = req.query
    if (!session_code) return res.status(400).json({ error: 'session_code required' })
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: session } = await supabase.from('sessions').select('*').eq('session_code', session_code).maybeSingle()
    if (!session) return res.status(404).json({ error: 'invalid session' })
    if (new Date(session.expires_at) < new Date()) return res.status(410).json({ error: 'session expired' })
    if (session.data?.type !== 'review') return res.status(400).json({ error: 'invalid review session' })
    const { data: visit } = await supabase.from('visits').select('*').eq('id', session.data.visit_id).maybeSingle()
    const { data: customer } = visit ? await supabase.from('customers').select('*').eq('id', visit.customer_id).maybeSingle() : { data: null }
    const { data: queueRow } = await supabase.from('queue').select('*').eq('visit_id', visit.id).maybeSingle()
    res.json({ visit, customer, ticket: queueRow?.ticket_code, session })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// List all reviews for admin
app.get('/api/reviews', async (req, res) => {
  try {
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: reviews, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(200)
    if (error) throw error

    const enriched = []
    for (const review of reviews) {
      const { data: visit } = await supabase.from('visits').select('*').eq('id', review.visit_id).maybeSingle()
      let customer = null
      if (visit?.customer_id) {
        const { data: c } = await supabase.from('customers').select('*').eq('id', visit.customer_id).maybeSingle()
        customer = c
      }
      enriched.push({ ...review, visit, customer })
    }

    res.json(enriched)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Search customers by name or phone
app.get('/api/customers', async (req, res) => {
  try {
    const { q } = req.query
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    let query = supabase.from('customers').select('*')
    if (q) {
      // search by phone exact or name ilike
      query = supabase.from('customers').select('*').or(`phone.eq.${q},name.ilike.%${q}%`)
    }
    const { data, error } = await query.limit(50)
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Get customer profile and visits
app.get('/api/customers/:id', async (req, res) => {
  try {
    const id = req.params.id
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: customer, error: cErr } = await supabase.from('customers').select('*').eq('id', id).maybeSingle()
    if (cErr) throw cErr
    if (!customer) return res.status(404).json({ error: 'customer not found' })

    const { data: visits } = await supabase.from('visits').select('*').eq('customer_id', id).order('created_at', { ascending: false })

    // enrich visits with services totals and last service
    const enriched = []
    const visitIds = (visits || []).map(v => v.id)
    let reviewsByVisit = new Map()
    if (visitIds.length) {
      const { data: reviewRows } = await supabase.from('reviews').select('*').in('visit_id', visitIds)
      for (const review of reviewRows || []) {
        reviewsByVisit.set(review.visit_id, review)
      }
    }

    for (const v of visits || []) {
      const services = v.services || []
      const total = services.reduce((a,b)=>a + Number(b.price || 0), 0)
      // last completed service
      const completed = services.filter(s=>s.completed_at).sort((a,b)=> new Date(b.completed_at) - new Date(a.completed_at))[0]
      let lastService = null
      if (completed) {
        // try to find service_logs for employee
        const { data: log } = await supabase.from('service_logs').select('*').eq('service_instance_id', completed.id).maybeSingle()
        lastService = { ...completed, employee_id: log?.employee_id || null }
      }
      enriched.push({ ...v, total, lastService, review: reviewsByVisit.get(v.id) || null })
    }

    // compute loyalty stats: total visits, services count
    const totalVisits = (visits || []).length
    const serviceCounts = (visits || []).reduce((a,v)=> a + ((v.services||[]).length), 0)
    const reviews = Array.from(reviewsByVisit.values())

    res.json({ customer, visits: enriched, totalVisits, serviceCounts, reviews })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Manual print endpoint
app.post('/api/print', async (req, res) => {
  try {
    const payload = req.body || {}
    const { salonName, ticket, customerName, services, employeeName, note } = payload
    const buffer = buildReceipt({ salonName, ticket, customerName, services, employeeName, note })
    const result = await sendToPrinter(buffer)
    res.json({ ok: true, result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Start a specific service on a visit
app.post('/api/visits/:visitId/services/:serviceId/start', async (req, res) => {
  try {
    const { visitId, serviceId } = req.params
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: visit, error: getErr } = await supabase.from('visits').select('*').eq('id', visitId).maybeSingle()
    if (getErr) throw getErr
    const services = visit.services || []
    const idx = services.findIndex(s => s.id === serviceId)
    if (idx === -1) return res.status(404).json({ error: 'service not found' })
    services[idx].status = 'serving'
    services[idx].started_at = new Date().toISOString()
    const { data: updated, error: updateErr } = await supabase.from('visits').update({ services }).eq('id', visitId).select('*').maybeSingle()
    if (updateErr) throw updateErr
    // create a service_log entry
    const employee_id = req.body.employee_id || null
    await supabase.from('service_logs').insert({ visit_id: visitId, service_id: services[idx].service_id, service_instance_id: services[idx].id, employee_id, started_at: services[idx].started_at })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// Complete a specific service on a visit
app.post('/api/visits/:visitId/services/:serviceId/complete', async (req, res) => {
  try {
    const { visitId, serviceId } = req.params
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: visit, error: getErr } = await supabase.from('visits').select('*').eq('id', visitId).maybeSingle()
    if (getErr) throw getErr
    const services = visit.services || []
    const idx = services.findIndex(s => s.id === serviceId)
    if (idx === -1) return res.status(404).json({ error: 'service not found' })
    services[idx].status = 'completed'
    services[idx].completed_at = new Date().toISOString()
    const { data: updated, error: updateErr } = await supabase.from('visits').update({ services }).eq('id', visitId).select('*').maybeSingle()
    if (updateErr) throw updateErr
    // update corresponding service_log
    const logQ = await supabase.from('service_logs').select('*').eq('service_instance_id', serviceId).eq('visit_id', visitId).maybeSingle()
    if (logQ.data) {
      const started = logQ.data.started_at
      const completed = services[idx].completed_at
      const duration = Math.max(0, Math.floor((new Date(completed) - new Date(started)) / 1000))
      await supabase.from('service_logs').update({ completed_at: completed, duration_seconds: duration }).eq('id', logQ.data.id)
    } else {
      // create log if missing
      const started = services[idx].started_at || null
      const completed = services[idx].completed_at
      const duration = started ? Math.max(0, Math.floor((new Date(completed) - new Date(started)) / 1000)) : null
      await supabase.from('service_logs').insert({ visit_id: visitId, service_id: services[idx].service_id, service_instance_id: services[idx].id, started_at: started, completed_at: completed, duration_seconds: duration })
    }
    res.json(updated)

    // If all services for this visit are completed -> trigger printing receipt
    const allCompleted = (updated.services || []).every(s => s.status === 'completed')
    if (allCompleted) {
      try {
        const visit = updated
        // compute total and duration
        const servicesForReceipt = (visit.services || []).map(s => ({ name: s.name, price: s.price, duration_minutes: s.duration_minutes }))
        const total = (visit.services || []).reduce((a,b)=>a + (Number(b.price||0)), 0)
        // fetch customer
        const { data: customer } = await (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
          .from('customers').select('*').eq('id', visit.customer_id).maybeSingle()

        const ticketRow = await (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
          .from('queue').select('*').eq('visit_id', visit.id).maybeSingle()

        const { data: existingReview } = await (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
          .from('reviews').select('*').eq('visit_id', visit.id).maybeSingle()
        let reviewLink = ''
        if (!existingReview) {
          const reviewSession = await createSession({ visit_id: visit.id, ticket: ticketRow.data?.ticket_code || '-', type: 'review' }, 7 * 24 * 3600, '/review')
          reviewLink = reviewSession.link
        }
        const receipt = buildReceipt({ salonName: process.env.SALON_NAME || 'صالون', ticket: ticketRow.data?.ticket_code || '-', customerName: customer?.name, services: servicesForReceipt, employeeName: '', reviewLink })
        const result = await sendToPrinter(receipt)
        console.log('Printed receipt', result)
      } catch (e) {
        console.error('Failed to print receipt', e)
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Server running on port', port))

// Background job: check queue and send reminders when position <= threshold
const REMIND_THRESHOLD = Number(process.env.REMIND_THRESHOLD || 2)
const REMIND_INTERVAL = Number(process.env.REMIND_INTERVAL_SECONDS || 60) * 1000

async function checkAndSendReminders() {
  try {
    const supabase = (await import('@supabase/supabase-js')).createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    const { data: rows, error } = await supabase.from('queue').select('*').eq('status', 'waiting').eq('reminder_sent', false).order('created_at', { ascending: true })
    if (error) throw error
    for (const r of rows) {
      // compute people ahead
      const { data: ahead } = await supabase.from('queue').select('id').eq('status', 'waiting').lt('created_at', r.created_at)
      const peopleAhead = (ahead || []).length
      if (peopleAhead <= REMIND_THRESHOLD) {
        // fetch customer
        const { data: visit } = await supabase.from('visits').select('*').eq('id', r.visit_id).maybeSingle()
        const { data: customer } = visit ? await supabase.from('customers').select('*').eq('id', visit.customer_id).maybeSingle() : { data: null }
        if (customer?.phone) {
          const msg = `قرب دورك! رقمك ${r.ticket_code}، يوجد قبلك ${peopleAhead} عملاء. استعد للوصول.`
          await notifications.sendWhatsApp(customer.phone, msg)
        }
        await supabase.from('queue').update({ reminder_sent: true }).eq('id', r.id)
      }
    }
  } catch (e) {
    console.error('Reminder job error', e)
  }
}

setInterval(checkAndSendReminders, REMIND_INTERVAL)

