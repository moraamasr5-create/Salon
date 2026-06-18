import React, { useState } from 'react';

// Mock data for demonstration
const mockData = {
  ticket: 'A023',
  position: 5, // Queue position
  status: 'waiting', // waiting | serving | completed
  peopleAhead: 4,
  service: 'قص شعر',
  expectedMinutes: 15,
};

// Helper to map status to badge colors
const statusMap = {
  waiting: { label: 'في الانتظار', color: '#C9A84C' },
  serving: { label: 'قيد الخدمة', color: '#4CAF50' },
  completed: { label: 'انتهى', color: '#2196F3' },
};

export default function TrackPage() {
  const [input, setInput] = useState('');
  const [show, setShow] = useState(false);

  // In a real app we'd fetch based on input; here we just display mock data
  const handleSearch = () => setShow(true);

  // Calculate progress for the arc (0-100%) based on expected minutes vs max 30 mins
  const progress = Math.min((mockData.expectedMinutes / 30) * 100, 100);

  return (
    <div className="page track-page">
      <h2>متابعة الدور</h2>
      <div className="input-section" style={{ marginBottom: 12 }}>
        <input
          placeholder="رقم الهاتف أو كود التذكرة"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSearch}>بحث</button>
      </div>

      {show && (
        <div className="track-info" style={{ border: '1px solid #444', padding: 12, textAlign: 'center' }}>
          {/* Queue Position */}
          <div className="queue-position" style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>
            {mockData.position}
          </div>
          <div className="label">موقعك في الصف</div>

          {/* Status Badge */}
          <div
            className="status-badge"
            style={{
              display: 'inline-block',
              background: statusMap[mockData.status].color,
              color: '#000',
              padding: '4px 12px',
              borderRadius: '12px',
              marginTop: '8px',
              animation: 'pulse 2s infinite',
            }}
          >
            {statusMap[mockData.status].label}
          </div>

          {/* Progress Arc */}
          <div className="progress-arc" style={{ margin: '20px auto', width: '120px', height: '120px' }}>
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831"
                fill="none"
                stroke="#444"
                strokeWidth="3.8"
              />
              <path
                className="circle"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="3.8"
                strokeLinecap="round"
              />
              <text x="18" y="20.35" className="percentage" textAnchor="middle" fill="#fff" fontSize="8">
                {mockData.expectedMinutes} دقيقة
              </text>
            </svg>
          </div>

          {/* People Ahead */}
          <div className="people-ahead">عدد الأشخاص قبلك: {mockData.peopleAhead}</div>

          {/* Current Service */}
          <div className="current-service">الخدمة الحالية: {mockData.service}</div>
        </div>
      )}
    </div>
  );
}

/*
// Future integration – fetch real status based on phone/ticket
// useEffect(() => {
//   if (!input) return;
//   fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:3000'}/api/track?${new URLSearchParams({ query: input })}`)
//     .then(r => r.json())
//     .then(setData)
//     .catch(console.error);
// }, [input]);
*/
