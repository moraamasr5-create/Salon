import React from 'react';

export default function DashboardOverview() {
  // Mock statistics
  const stats = {
    waiting: 7,
    serving: 3,
    completedToday: 42,
    avgRating: 4.5,
  };

  const Card = ({ title, value }) => (
    <div className="stat-card" style={{
      background: '#111',
      borderRadius: 'var(--radius)',
      padding: 'var(--spacing-md)',
      flex: 1,
      margin: '0 var(--spacing-sm)',
      textAlign: 'center',
    }}>
      <div className="value" style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>{value}</div>
      <div className="title" style={{ marginTop: 'var(--spacing-xs)', color: 'var(--color-text)' }}>{title}</div>
    </div>
  );

  return (
    <div className="overview" style={{
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: 'var(--spacing-lg)',
    }}>
      <Card title="في الانتظار" value={stats.waiting} />
      <Card title="قيد الخدمة" value={stats.serving} />
      <Card title="اكتمل اليوم" value={stats.completedToday} />
      <Card title="متوسط التقييم" value={stats.avgRating} />
    </div>
  );
}
