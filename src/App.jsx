import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Scan from './pages/Scan'
import Form from './pages/Form'
import Confirm from './pages/Confirm'
import Tablet from './pages/Tablet'
import Services from './pages/Services'
import Track from './pages/Track'
import Review from './pages/Review'
import Reviews from './pages/Reviews'
import CRMSearch from './pages/CRMSearch'
import CustomerProfile from './pages/CustomerProfile'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>صالون - تسجيل الدور</h1>
        <nav>
          <Link to="/scan">مسح QR</Link>
          <Link to="/form">نموذج</Link>
          <Link to="/track">متابعة</Link>
          <Link to="/crm">ملف العميل</Link>
          <Link to="/reviews">التقييمات</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Scan />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/form" element={<Form />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/tablet" element={<Tablet />} />
          <Route path="/services" element={<Services />} />
          <Route path="/track" element={<Track />} />
          <Route path="/review" element={<Review />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/crm" element={<CRMSearch />} />
          <Route path="/crm/:id" element={<CustomerProfile />} />
        </Routes>
      </main>
    </div>
  )
}
