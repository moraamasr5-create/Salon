import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Confirm() {
  const { state } = useLocation()
  if (!state) return <div className="page"><p>لا توجد بيانات.</p></div>

  // mock computation:
  const peopleAhead = Math.floor(Math.random() * 5)
  const expectedMinutes = (peopleAhead + 1) * 10

  return (
    <div className="page">
      <h2>تم تسجيلك ✅</h2>
      <p>رقمك: <strong>{state.ticketNumber}</strong></p>
      <p>يوجد قبلك: <strong>{peopleAhead} عملاء</strong></p>
      <p>الوقت المتوقع: <strong>{expectedMinutes} دقيقة</strong></p>
      <p>رمز الجلسة: {state.sessionId}</p>
      <p>تاريخ الانتهاء (token): {new Date(state.expiresAt).toLocaleTimeString()}</p>
      <p>شكرًا لاستخدامك الخدمة.</p>
    </div>
  )
}
