import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CustomerLayout({ children }) {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname.startsWith('/dashboard');

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">صالون عز</h1>
        {!hideNav && (
          <nav className="nav">
            <Link to="/">الرئيسية</Link>
            <Link to="/book">حجز</Link>
            <Link to="/track">متابعة</Link>
            <Link to="/review">تقييم</Link>
          </nav>
        )}
      </header>
      <main className="main">
        {children}
      </main>
    </div>
  );
}
