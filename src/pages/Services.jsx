import React, { useState } from 'react';

// Mock services data (replace with real API later)
const mockServices = [
  { id: 1, name: 'قص شعر', price: 50, duration_minutes: 30, category: 'شعر', tips: 'استخدام مشط' },
  { id: 2, name: 'تشذيب لحية', price: 40, duration_minutes: 20, category: 'لحية', tips: '' },
  { id: 3, name: 'علاج بشرة', price: 120, duration_minutes: 45, category: 'بشرة', tips: 'تطبيق كريم' },
  // Add more mock services as needed
];

export default function ServiceSelector() {
  const [services] = useState(mockServices);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeCategory, setActiveCategory] = useState('الكل');

  const categories = ['الكل', ...Array.from(new Set(services.map(s => s.category)))];

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filtered = activeCategory === 'الكل' ? services : services.filter(s => s.category === activeCategory);
  const selectedServices = services.filter(s => selectedIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="page service-selector">
      <h2>اختر الخدمات</h2>
      {/* Category filter bar */}
      <div className="category-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={cat === activeCategory ? 'active' : ''}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services grid */}
      <div className="services-grid">
        {filtered.map(s => (
          <div
            key={s.id}
            className={`service-card ${selectedIds.includes(s.id) ? 'selected' : ''}`}
            onClick={() => toggleSelect(s.id)}
          >
            <div className="service-header">
              <span className="service-name">{s.name}</span>
              {selectedIds.includes(s.id) && <span className="checkmark">✔︎</span>}
            </div>
            <div className="service-info">
              <span className="price">{s.price} ر.س</span>
              <span className="duration">{s.duration_minutes} دقيقة</span>
            </div>
            {s.tips && <div className="tips">{s.tips}</div>}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="summary">
        <h3>الخدمات المختارة</h3>
        {selectedServices.length === 0 ? (
          <p>لم يتم اختيار أي خدمة.</p>
        ) : (
          <ul>
            {selectedServices.map(s => (
              <li key={s.id}>{s.name} - {s.price} ر.س</li>
            ))}
          </ul>
        )}
        <p className="total">الإجمالي: {totalPrice} ر.س</p>
      </div>
    </div>
  );
}

/*
// Original data‑fetch logic (commented for future integration):
// import { useEffect } from 'react';
// const [services, setServices] = useState([]);
// useEffect(() => {
//   fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/services`)
//     .then(r => r.json())
//     .then(setServices)
//     .catch(console.error);
// }, []);
*/

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
