import React, { useState, useEffect } from 'react'

export default function Track(){
  const [phone, setPhone] = useState('')
  const [ticket, setTicket] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [polling, setPolling] = useState(false)

  async function fetchStatus(params){
    setError(null)
    const qs = new URLSearchParams(params)
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/track?' + qs.toString())
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error')
      setData(json)
      setPolling(true)
    } catch (e) {
      setError(e.message)
      setData(null)
      setPolling(false)
    }
  }

  useEffect(()=>{
    if (!polling || !data) return
    const id = setInterval(()=>{
      // refresh by same ticket
      if (data?.ticket) fetchStatus({ ticket: data.ticket })
    }, 5000)
    return ()=>clearInterval(id)
  }, [polling, data])

  return (
    <div className="page">
      <h2>متابعة الدور</h2>
      <div style={{ marginBottom:12 }}>
        <input placeholder="رقم الهاتف (مثال +2010...)" value={phone} onChange={e=>setPhone(e.target.value)} />
        <button onClick={()=>fetchStatus({ phone })}>بحث</button>
      </div>
      <div style={{ marginBottom:12 }}>
        <input placeholder="كود التذكرة (مثال A023)" value={ticket} onChange={e=>setTicket(e.target.value)} />
        <button onClick={()=>fetchStatus({ ticket })}>بحث</button>
      </div>
      {error && <p style={{ color:'red' }}>{error}</p>}
      {data && (
        <div style={{ border:'1px solid #ddd', padding:12 }}>
          <p>رقمك: <strong>{data.ticket}</strong></p>
          <p>الحالة: <strong>{data.status}</strong></p>
          <p>يوجد قبلك: <strong>{data.peopleAhead}</strong></p>
          <p>الوقت المتوقع: <strong>{data.expectedMinutes ?? '-'} دقيقة</strong></p>
          <p>الاسم: {data.customer?.name || '-'}</p>
        </div>
      )}
    </div>
  )
}
