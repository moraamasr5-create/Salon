import React from 'react';
import { Link } from 'react-router-dom';

export default function RootLayout({ children }) {
  return (
    <div className="app">
      <header className="header">
        <h1 className="title">صالون - إدارة الدور</h1>
        <nav className="nav">
          <Link to="/">الرئيسية</Link>
          <Link to="/book">حجز</Link>
          <Link to="/track">متابعة</Link>
          <Link to="/review">تقييم</Link>
          <Link to="/dashboard">لوحة التحكم</Link>
          <Link to="/login">تسجيل الدخول</Link>
        </nav>
      </header>
      <main className="main">
        {children}
      </main>
    </div>
  );
}
