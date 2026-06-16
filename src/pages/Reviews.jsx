import React, { useEffect, useState } from 'react'

export default function Reviews() {
  const [reviews, setReviews] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setReviews(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>جاري التحميل…</p></div>
  if (error) return <div className="page"><p className="error">{error}</p></div>

  return (
    <div className="page">
      <h2>التقييمات</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>إجمالي التقييمات:</strong> {reviews.length}
      </div>
      <div>
        {reviews.length === 0 && <p>لا توجد تقييمات بعد.</p>}
        {reviews.map(review => (
          <div key={review.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12, borderRadius: 8 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>الزيارة:</strong> {new Date(review.created_at).toLocaleString()}
            </div>
            <div><strong>العميل:</strong> {review.customer_name || review.customer?.name || '-'}</div>
            <div><strong>الخدمة:</strong> {review.visit?.services?.map(s => s.name).join(', ') || '-'}</div>
            <div><strong>التقييم:</strong> {review.rating} ★</div>
            {review.comment && <div><strong>التعليق:</strong> {review.comment}</div>}
            <div><strong>رابط الزيارة:</strong> <a href={`/customer/${review.visit?.customer_id}`} target="_blank" rel="noreferrer">عرض العميل</a></div>
          </div>
        ))}
      </div>
    </div>
  )
}
