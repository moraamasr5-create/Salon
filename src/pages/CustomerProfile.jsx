import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function CustomerProfile(){
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{
    if (!id) return
    fetch((import.meta.env.VITE_API_BASE||'http://localhost:3000') + '/api/customers/' + id)
      .then(r=>r.json())
      .then(setData)
      .catch(console.error)
  },[id])

  if (!data) return <div className="page"><p>جاري التحميل...</p></div>

  const { customer, visits, totalVisits, serviceCounts } = data

  const lastVisit = visits && visits.length ? visits[0] : null
  const lastService = lastVisit?.lastService
  const existingReview = lastVisit?.review
  const [shareLink, setShareLink] = useState(null)
  const [reviewLink, setReviewLink] = useState(null)
  const [visitReviewLinks, setVisitReviewLinks] = useState({})
  const [sharing, setSharing] = useState(false)
  const [shareMsg, setShareMsg] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')

  async function handleShare() {
    if (!lastVisit) return alert('لا توجد زيارة للمشاركة')
    setSharing(true)
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:3000') + '/api/share', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ visit_id: lastVisit.id, ttl_hours: 24 }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'failed')
      setShareLink(json.link)
      const text = `متابعة دورك\nرقم: ${json.ticket || '-'}\n${json.link}`
      setShareMsg(text)
    } catch (e) {
      console.error(e)
      alert('فشل إنشاء رابط المشاركة')
    } finally {
      setSharing(false)
    }
  }

  async function handleReviewLink(visitId) {
    if (!visitId) return alert('لا توجد زيارة للتقييم')
    setReviewMsg('')
    setSharing(true)
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:3000') + '/api/review/link', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ visit_id: visitId, ttl_hours: 72 }) })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'failed')
      setVisitReviewLinks(prev => ({ ...prev, [visitId]: json.link }))
      setReviewLink(json.link)
      setReviewMsg('تم إنشاء رابط التقييم. يمكن مشاركته مع العميل أو طباعته.')
    } catch (e) {
      console.error(e)
      setReviewMsg('فشل إنشاء رابط التقييم: ' + (e.message || ''))
    } finally {
      setSharing(false)
    }
  }

  async function copyLink(){
    if (!shareLink) return
    try{ await navigator.clipboard.writeText(shareLink); alert('تم نسخ رابط المتابعة') }catch(e){ console.error(e); alert('فشل النسخ') }
  }

  async function copyReviewLink(){
    const link = reviewLink || visitReviewLinks[lastVisit?.id]
    if (!link) return
    try{ await navigator.clipboard.writeText(link); alert('تم نسخ رابط التقييم') }catch(e){ console.error(e); alert('فشل النسخ') }
  }

  function openWhatsApp(){
    const url = 'https://wa.me/?text=' + encodeURIComponent(shareMsg)
    window.open(url, '_blank')
  }

  function openSMS(){
    const body = encodeURIComponent(shareMsg)
    const to = customer.phone || ''
    const url = `sms:${to}?body=${body}`
    window.location.href = url
  }

  return (
    <div className="page">
      <h2>الملف الشخصي للعميل</h2>
      <div style={{ border:'1px solid #ddd', padding:12 }}>
        <p><strong>{customer.name}</strong></p>
        <p>الهاتف: {customer.phone}</p>
        <p>عدد الزيارات: {totalVisits}</p>
        <p>إجمالي الخدمات: {serviceCounts}</p>
      </div>

      <h3>آخر زيارة</h3>
      {lastVisit ? (
        <div style={{ border:'1px solid #eee', padding:8 }}>
          <p>تاريخ: {new Date(lastVisit.created_at).toLocaleString()}</p>
          <p>الحالة: {lastVisit.status}</p>
          <p>المبلغ: {lastVisit.total} EGP</p>
          <p>الحلاق: {lastService?.employee_id || lastVisit.employee_id || '-'}</p>
          <p>الملاحظات: {lastVisit.notes || '-'}</p>
          <h4>الخدمات في الزيارة</h4>
          <ul>
            {lastVisit.services && lastVisit.services.map(s=> (
              <li key={s.id}>{s.name} — {s.price} EGP — {s.status}</li>
            ))}
          </ul>
          <div style={{ marginTop: 8 }}>
            <button onClick={handleShare} disabled={sharing}>{sharing ? 'جارٍ إنشاء الرابط…' : 'مشاركة رابط المتابعة'}</button>
            <button onClick={() => handleReviewLink(lastVisit.id)} disabled={sharing || !!existingReview} style={{ marginLeft: 8 }}>
              {existingReview ? 'تم التقييم' : sharing ? 'جارٍ المعالجة…' : 'إنشاء رابط التقييم'}
            </button>
            {shareLink && (
              <div style={{ marginTop:8, border:'1px dashed #ccc', padding:8 }}>
                <div>رابط المتابعة: <a href={shareLink} target="_blank" rel="noreferrer">{shareLink}</a></div>
                <div style={{ marginTop:8 }}>
                  <button onClick={copyLink}>نسخ الرابط</button>
                  <button onClick={openWhatsApp} style={{ marginLeft:8 }}>مشاركة عبر WhatsApp</button>
                  <button onClick={openSMS} style={{ marginLeft:8 }}>مشاركة عبر SMS</button>
                </div>
              </div>
            )}
            {reviewLink && (
              <div style={{ marginTop:8, border:'1px dashed #ccc', padding:8 }}>
                <div>رابط التقييم: <a href={reviewLink} target="_blank" rel="noreferrer">{reviewLink}</a></div>
                <button onClick={copyReviewLink} style={{ marginTop:8 }}>نسخ رابط التقييم</button>
              </div>
            )}
            {reviewMsg && <div style={{ marginTop:8, color: reviewLink ? 'green' : 'red' }}>{reviewMsg}</div>}
          </div>
        </div>
      ) : <p>لا توجد زيارات سابقة.</p>}

      <h3>الأرشيف</h3>
      <ul>
        {visits.map(v => (
          <li key={v.id} style={{ border:'1px solid #f1f1f1', padding:8, marginTop:8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>{new Date(v.created_at).toLocaleString()} — {v.status} — المبلغ: {v.total} EGP</div>
              {!v.review && !visitReviewLinks[v.id] && (
                <button onClick={() => handleReviewLink(v.id)} disabled={sharing} style={{ marginLeft: 8 }}>
                  إنشاء رابط تقييم لهذه الزيارة
                </button>
              )}
            </div>
            {v.review ? (
              <div style={{ marginTop:4, padding:6, background:'#f6f6ff', border:'1px solid #ccd' }}>
                <strong>تم التقييم:</strong> {v.review.rating} نجوم
                {v.review.comment && <div>تعليق: {v.review.comment}</div>}
              </div>
            ) : visitReviewLinks[v.id] ? (
              <div style={{ marginTop:4, padding:6, background:'#f9f9f9', border:'1px dashed #ccc' }}>
                <div>رابط التقييم لهذه الزيارة:</div>
                <a href={visitReviewLinks[v.id]} target="_blank" rel="noreferrer">{visitReviewLinks[v.id]}</a>
                <div style={{ marginTop:6 }}>
                  <button onClick={() => navigator.clipboard.writeText(visitReviewLinks[v.id])}>نسخ الرابط</button>
                </div>
              </div>
            ) : null}
            <ul>
              {(v.services || []).map(s => <li key={s.id}>{s.name} — {s.price} EGP — {s.status}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
