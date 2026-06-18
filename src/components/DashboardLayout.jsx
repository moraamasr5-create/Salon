import React from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import DashboardOverview from '../pages/DashboardOverview';
import DashboardQueue from '../pages/DashboardQueue';
import DashboardServices from '../pages/DashboardServices';
import DashboardStaff from '../pages/DashboardStaff';
import DashboardReviews from '../pages/DashboardReviews';
import DashboardSettings from '../pages/DashboardSettings';

const navLinkStyle = {
  color: 'inherit',
  textDecoration: 'none',
  display: 'block',
  padding: '8px var(--spacing-sm)',
  borderRadius: 'var(--radius)',
  marginBottom: '4px',
};

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
      {/* Sidebar */}
      <nav className="sidebar" style={{ width: '220px', background: '#111', padding: 'var(--spacing-md)', color: 'var(--color-text)' }}>
        <h2 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>لوحة التحكم</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'nav-active' : ''} style={navLinkStyle}>
              نظرة عامة
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/queue" className={({ isActive }) => isActive ? 'nav-active' : ''} style={navLinkStyle}>
              قائمة الانتظار
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/services" className={({ isActive }) => isActive ? 'nav-active' : ''} style={navLinkStyle}>
              الخدمات
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/staff" className={({ isActive }) => isActive ? 'nav-active' : ''} style={navLinkStyle}>
              الموظفون
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/reviews" className={({ isActive }) => isActive ? 'nav-active' : ''} style={navLinkStyle}>
              التقييمات
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? 'nav-active' : ''} style={navLinkStyle}>
              الإعدادات
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Main area */}
      <div className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header className="top-bar" style={{ background: '#111', padding: 'var(--spacing-sm) var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text)' }}>
          <span className="salon-name" style={{ fontWeight: '600', fontSize: '1.2rem' }}>صالون الأناقة</span>
          <div className="actions" style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
            <button aria-label="الإشعارات" style={{ background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.4rem', cursor: 'pointer' }}>🔔</button>
            <button
              onClick={() => { localStorage.removeItem('salon_authed'); window.location.href = '/login'; }}
              style={{ background: 'var(--color-primary)', border: 'none', borderRadius: 'var(--radius)', color: 'var(--color-bg)', padding: 'var(--spacing-xs) var(--spacing-sm)', cursor: 'pointer' }}
            >
              تسجيل الخروج
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="content" style={{ flex: 1, padding: 'var(--spacing-md)', overflowY: 'auto' }}>
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="queue" element={<DashboardQueue />} />
            <Route path="services" element={<DashboardServices />} />
            <Route path="staff" element={<DashboardStaff />} />
            <Route path="reviews" element={<DashboardReviews />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
