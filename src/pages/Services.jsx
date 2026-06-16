import React, { useEffect, useState } from 'react'

function groupByCategory(items) {
  return items.reduce((acc, it) => {
    const cat = it.category || 'أخرى'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(it)
    return acc
  }, {})
}

export default function Services() {
  const [services, setServices] = useState([])

  useEffect(() => {
    fetch((import.meta.env.VITE_API_BASE || 'http://localhost:3000') + '/api/services')
      .then(r => r.json())
      .then(setServices)
      .catch(console.error)
  }, [])

  const grouped = groupByCategory(services)

  return (
    <div className="page">
      <h2>قائمة الخدمات</h2>
      {Object.keys(grouped).map(cat => (
        <section key={cat} style={{ marginBottom: 16 }}>
          <h3>{cat}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {grouped[cat].map(s => (
              <li key={s.id} style={{ border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
                <div><strong>{s.name}</strong> — {s.price} EGP</div>
                <div>المدة: {s.duration_minutes} دقيقة</div>
                <div>نصيحة: {s.tips || '-'}</div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
