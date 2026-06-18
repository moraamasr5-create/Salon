import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useQueue from '../hooks/useQueue'

export default function Form() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [visited, setVisited] = useState(false)
  const [mode, setMode] = useState('join')
  const { addTicket } = useQueue()

  function submit() {
    try {
      const ticketNumber = `A${Math.floor(1000 + Math.random() * 9000)}`
      const newTicket = { name, phone, services: [], mode, ticketNumber }
      addTicket(newTicket)
      navigate('/confirm', { state: { ticketNumber, name, phone, expiresAt: Date.now() + 5*60*1000 } })
    } catch (err) {
      alert('فشل في إنشاء التذكرة: ' + err.message)
    }
  }

  return (
    <div className="page">
      <h2>نموذج التسجيل</h2>
      <div className="form" style={{cursor: 'pointer'}}>
        <label>الاسم (مطلوب)
          <input value={name} onChange={e=>setName(e.target.value)} required />
        </label>
        <label>رقم الهاتف (مطلوب)
          <input value={phone} onChange={e=>setPhone(e.target.value)} required />
        </label>
        <label>
          <input type="checkbox" checked={visited} onChange={e=>setVisited(e.target.checked)} /> زرتنا من قبل؟
        </label>
        <div>
          <label>
            <input type="radio" name="mode" value="join" checked={mode==='join'} onChange={()=>setMode('join')} /> انضمام للدور
          </label>
          <label>
            <input type="radio" name="mode" value="book" checked={mode==='book'} onChange={()=>setMode('book')} /> حجز الآن
          </label>
        </div>
        <button type="button" onClick={submit}>تأكيد</button>
      </div>
    </div>
  )
}
