import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Review() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sessionCode, setSessionCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [review, setReview] = useState({ rating: 0, comment: '' })
  const [meta, setMeta] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('session')
    if (!code) {
      setError('رابط التقييم غير صحيح.')
      setLoading(false)
      return
    }
    setSessionCode(code)
    fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/review-session?session_code=' + encodeURIComponent(code))
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'فشل تحميل الجلسة')
        setMeta(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [location.search])

  async function submitReview(e) {
    e.preventDefault()
    if (!review.rating) return setError('يرجى اختيار عدد النجوم.')
    setLoading(true)
    setError(null)
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_code: sessionCode, rating: review.rating, comment: review.comment })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit review')
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page"><p>جاري التحميل…</p></div>
  if (error) return <div className="page"><p className="error">{error}</p></div>
  if (submitted) return (
    <div className="page">
      <h2>شكراً لتقييمك!</h2>
      <p>تم تسجيل تقييمك بنجاح.</p>
      <button onClick={() => navigate('/')} style={{ marginTop: 16 }}>العودة للرئيسية</button>
    </div>
  )

  return (
    <div className="page">
      <h2>تقييم الخدمة</h2>
      <p>رقم التذكرة: <strong>{meta?.ticket || '-'}</strong></p>
      <p>اسم العميل: <strong>{meta?.customer?.name || '-'}</strong></p>
      <p>الخدمات:</p>
      <ul>
        {(meta?.visit?.services || []).map(s => (
          <li key={s.id}>{s.name} — {s.price} EGP</li>
        ))}
      </ul>
      <form onSubmit={submitReview} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: 12 }}>
          <label>اختر عدد النجوم</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {[1,2,3,4,5].map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setReview(prev => ({ ...prev, rating: value }))}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: review.rating === value ? '2px solid #000' : '1px solid #ccc',
                  background: review.rating >= value ? '#ffd700' : '#fff'
                }}
              >{value} ★</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>تعليق (اختياري)</label>
          <textarea
            value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            style={{ width: '100%', padding: 8, marginTop: 6 }}
          />
        </div>
        {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'جارٍ الإرسال…' : 'إرسال التقييم'}</button>
      </form>
    </div>
  )
}
