import React, { useState } from 'react';

// Mock queue data
const initialQueue = [
  {
    id: 1,
    name: 'أحمد السعيد',
    phone: '+201234567890',
    services: ['قص شعر', 'تشذيب لحية'],
    waitTime: 12,
    status: 'waiting', // waiting | serving | completed
  },
  {
    id: 2,
    name: 'سارة علي',
    phone: '+201098765432',
    services: ['علاج بشرة'],
    waitTime: 5,
    status: 'serving',
  },
  {
    id: 3,
    name: 'محمد عبد الله',
    phone: '+201112223334',
    services: ['قص شعر', 'علاج بشرة'],
    waitTime: 0,
    status: 'completed',
  },
];

function StatusBadge({ status }) {
  const map = {
    waiting: { label: 'في الانتظار', color: '#C9A84C' },
    serving: { label: 'قيد الخدمة', color: '#4CAF50' },
    completed: { label: 'تم', color: '#2196F3' },
  };
  const { label, color } = map[status] || {};
  return (
    <span
      style={{
        background: color,
        color: '#000',
        borderRadius: '12px',
        padding: '2px 8px',
        fontSize: '0.85rem',
      }}
    >
      {label}
    </span>
  );
}

export default function QueuePage() {
  const [queue, setQueue] = useState(initialQueue);
  const [filter, setFilter] = useState('all');

  const filtered = queue.filter((item) =>
    filter === 'all' ? true : item.status === filter
  );

  const changeStatus = (id, newStatus) => {
    setQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Sort by id (position)
  const sorted = [...filtered].sort((a, b) => a.id - b.id);

  return (
    <div className="page queue-page" style={{ padding: 'var(--spacing-md)' }}>
      <h2>قائمة الانتظار</h2>

      {/* Filter tabs */}
      <div className="filter-tabs" style={{ marginBottom: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
        {['all', 'waiting', 'serving', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              background: filter === tab ? 'var(--color-primary)' : '#333',
              color: filter === tab ? 'var(--color-bg)' : '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
            }}
          >
            {tab === 'all' ? 'الكل' : tab === 'waiting' ? 'في الانتظار' : tab === 'serving' ? 'قيد الخدمة' : 'تم'}
          </button>
        ))}
      </div>

      {/* Queue cards */}
      <div className="cards" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {sorted.map((item) => (
          <div
            key={item.id}
            className="queue-card"
            style={{
              background: '#111',
              borderRadius: 'var(--radius)',
              padding: 'var(--spacing-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{item.name}</strong>
                <div style={{ fontSize: '0.85rem' }}>{item.phone}</div>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>الخدمات:</strong> {item.services.join(', ')}
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              <strong>الوقت المتوقع:</strong> {item.waitTime} دقيقة
            </div>
            {/* Action button */}
            {item.status === 'waiting' && (
              <button onClick={() => changeStatus(item.id, 'serving')} style={{ alignSelf: 'flex-start', background: 'var(--color-primary)', color: 'var(--color-bg)', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' }}>
                ابدأ الخدمة
              </button>
            )}
            {item.status === 'serving' && (
              <button onClick={() => changeStatus(item.id, 'completed')} style={{ alignSelf: 'flex-start', background: '#f44336', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' }}>
                أنهي الخدمة
              </button>
            )}
            {item.status === 'completed' && (
              <span style={{ fontSize: '1.2rem' }} title="إيصال">
                📄
              </span>
            )}
          </div>
        ))}
        {sorted.length === 0 && <p>لا توجد طلبات في الحالة المحددة.</p>}
      </div>
    </div>
  );
}

/*
  // Future integration – fetch real queue data
  // useEffect(() => {
  //   fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/queue`)
  //     .then(r => r.json())
  //     .then(setData)
  //     .catch(console.error);
  // }, []);
*/
