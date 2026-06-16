import React, { useEffect, useState } from 'react'

export default function Tablet() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])
  const [openFor, setOpenFor] = useState(null) // visit id for service selection
  const [selected, setSelected] = useState(new Set())

  async function fetchQueue() {
    setLoading(true)
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/queue')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
    const id = setInterval(fetchQueue, 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // fetch available services
    fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/services')
      .then(r => r.json())
      .then(setServices)
      .catch(console.error)
  }, [])

  async function start(id) {
    await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + `/api/queue/${id}/start`, { method: 'POST' })
    fetchQueue()
  }

  async function complete(id) {
    await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + `/api/queue/${id}/complete`, { method: 'POST' })
    fetchQueue()
  }

  return (
    <div className="page">
      <h2>لوحة الطابور</h2>
      {loading && <p>جاري التحديث…</p>}
      <ul>
        {items.map(item => (
          <li key={item.id} style={{ marginBottom: 12, border: '1px solid #ddd', padding: 8 }}>
            <div><strong>{item.ticket_code}</strong> — {item.customer?.name || 'عميل مجهول'}</div>
            <div>هاتف: {item.customer?.phone || '-'}</div>
            <div>وقت الدخول: {new Date(item.created_at).toLocaleTimeString()}</div>
            <div>الحالة: {item.status}</div>
            <div style={{ marginTop: 8 }}>
              {item.status !== 'serving' && <button onClick={()=>start(item.id)}>بدء الخدمة</button>}
              {item.status === 'serving' && <button onClick={()=>complete(item.id)}>إنهاء الخدمة</button>}
              <button onClick={()=>{ setOpenFor(item.visit.id); setSelected(new Set()) }}>اختيار الخدمات</button>
            </div>
            <div style={{ marginTop: 8 }}>
              <strong>خدمات الزيارة:</strong>
              <ul>
                {(item.visit?.services || []).map(s => (
                  <li key={s.id} style={{ marginTop:6 }}>
                    {s.name} — {s.status}
                    {s.status === 'waiting' && <button style={{ marginLeft:8 }} onClick={()=>{ fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000')+`/api/visits/${item.visit.id}/services/${s.id}/start`, { method: 'POST' }).then(fetchQueue) }}>بدء</button>}
                    {s.status === 'serving' && <button style={{ marginLeft:8 }} onClick={()=>{ fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000')+`/api/visits/${item.visit.id}/services/${s.id}/complete`, { method: 'POST' }).then(fetchQueue) }}>إنهاء</button>}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      {openFor && (
        <div style={{ position: 'fixed', left: 0, right:0, top:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', padding:20, maxWidth:600, width:'90%' }}>
            <h3>اختيار الخدمات للزيارة</h3>
            <div style={{ maxHeight:300, overflow:'auto' }}>
              {Object.entries(groupByCategory(services)).map(([cat, list]) => (
                <div key={cat}>
                  <h4>{cat}</h4>
                  {list.map(s => (
                    <label key={s.id} style={{ display:'block' }}>
                      <input type="checkbox" checked={selected.has(s.id)} onChange={(e)=>{
                        const next = new Set(selected)
                        if (e.target.checked) next.add(s.id); else next.delete(s.id)
                        setSelected(next)
                      }} /> {s.name} — {s.price} EGP — {s.duration_minutes} دقيقة
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ marginTop:12 }}>
              <button onClick={async ()=>{
                const ids = Array.from(selected)
                await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000')+`/api/visits/${openFor}/services`, {
                  method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ service_ids: ids })
                })
                setOpenFor(null)
                fetchQueue()
              }}>تأكيد</button>
              <button onClick={()=>setOpenFor(null)} style={{ marginLeft:8 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function groupByCategory(items) {
  return (items || []).reduce((acc, it) => {
    const cat = it.category || 'أخرى'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(it)
    return acc
  }, {})
}
