import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
      {/* Sidebar */}
      <nav className="sidebar" style={{ width: '220px', background: '#111', padding: 'var(--spacing-md)', color: 'var(--color-text)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>لوحة التحكم</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><NavLink to="/dashboard" end style={{ color: 'inherit', textDecoration: 'none' }} activeStyle={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>نظرة عامة</NavLink></li>
          <li><NavLink to="/dashboard/queue" style={{ color: 'inherit', textDecoration: 'none' }} activeStyle={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>قائمة الانتظار</NavLink></li>
          <li><NavLink to="/dashboard/services" style={{ color: 'inherit', textDecoration: 'none' }} activeStyle={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>الخدمات</NavLink></li>
          <li><NavLink to="/dashboard/staff" style={{ color: 'inherit', textDecoration: 'none' }} activeStyle={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>الموظفون</NavLink></li>
          <li><NavLink to="/dashboard/reviews" style={{ color: 'inherit', textDecoration: 'none' }} activeStyle={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>التقييمات</NavLink></li>
          <li><NavLink to="/dashboard/settings" style={{ color: 'inherit', textDecoration: 'none' }} activeStyle={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>الإعدادات</NavLink></li>
        </ul>
      </nav>

      {/* Main area */}
      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header className="top-bar" style={{ background: '#111', padding: 'var(--spacing-sm) var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text)' }}>
          <span className="salon-name" style={{ fontWeight: '600', fontSize: '1.2rem' }}>صالون الأناقة</span>
          <div className="actions" style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button aria-label="الإشعارات" style={{ background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.4rem', cursor: 'pointer' }}>🔔</button>
            <button style={{ background: 'var(--color-primary)', border: 'none', borderRadius: 'var(--radius)', color: 'var(--color-bg)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' }}>تسجيل الخروج</button>
          </div>
        </header>

        {/* Content */}
        <main className="content" style={{ flex: 1, padding: 'var(--spacing-md)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
