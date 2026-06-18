import React, { useState } from 'react';
import useQueue from '../hooks/useQueue';

// Mock data for demonstration
// Default Mock data for demonstration
const defaultMockData = {
  ticket: 'A023',
  position: 3, // Queue position
  status: 'waiting', // waiting | serving | completed
  peopleAhead: 2,
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
  const [ticketData, setTicketData] = useState(defaultMockData);
  const { queue } = useQueue();

  const handleSearch = () => {
    const found = queue.find(t => t.phone === input || t.ticketNumber === input || t.id.toString() === input);
    
    if (found) {
      const waitingTickets = queue.filter(t => t.status === 'waiting');
      const positionIndex = waitingTickets.findIndex(t => t.id === found.id);
      const position = positionIndex >= 0 ? positionIndex + 1 : 0;
      
      setTicketData({
        ticket: found.ticketNumber || found.id,
        position: position || '-',
        status: found.status || 'waiting',
        peopleAhead: position > 0 ? position - 1 : 0,
        service: found.services?.length ? found.services.map(s => s.name).join(', ') : 'خدمة عامة',
        expectedMinutes: (position > 0 ? position * 10 : 0) || 10
      });
    } else {
      setTicketData({ ...defaultMockData, ticket: input || defaultMockData.ticket });
    }
    setShow(true);
  };

  // Calculate progress for the arc (0-100%) based on expected minutes vs max 30 mins
  const progress = Math.min((ticketData.expectedMinutes / 30) * 100, 100);

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
            {ticketData.position}
          </div>
          <div className="label">موقعك في الصف</div>

          {/* Status Badge */}
          <div
            className="status-badge"
            style={{
              display: 'inline-block',
              background: statusMap[ticketData.status].color,
              color: '#000',
              padding: '4px 12px',
              borderRadius: '12px',
              marginTop: '8px',
              animation: 'pulse 2s infinite',
            }}
          >
            {statusMap[ticketData.status].label}
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
                {ticketData.expectedMinutes} دقيقة
              </text>
            </svg>
          </div>

          {/* People Ahead */}
          <div className="people-ahead">عدد الأشخاص قبلك: {ticketData.peopleAhead}</div>

          {/* Current Service */}
          <div className="current-service">الخدمة الحالية: {ticketData.service}</div>
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
