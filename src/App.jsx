import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Scan from './pages/Scan';
import Form from './pages/Form';
import Confirm from './pages/Confirm';
import Tablet from './pages/Tablet';
import Services from './pages/Services';
import TrackPage from './pages/TrackPage';
import ReviewPage from './pages/ReviewPage';
import Reviews from './pages/Reviews';
import CRMSearch from './pages/CRMSearch';
import CustomerProfile from './pages/CustomerProfile';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import DashboardQueue from './pages/DashboardQueue';
import DashboardServices from './pages/DashboardServices';
import DashboardStaff from './pages/DashboardStaff';
import DashboardReviews from './pages/DashboardReviews';
import DashboardSettings from './pages/DashboardSettings';
import Login from './pages/Login';
import RootLayout from './components/RootLayout';
import AuthGuard from './components/AuthGuard';
import Landing from './pages/Landing';

export default function App() {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/book" element={<Form />} />
        <Route path="/track" element={<TrackPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/dashboard/*" element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        } />
        <Route path="/login" element={<Login />} />
        {/* keep existing routes for compatibility */}
        <Route path="/scan" element={<Scan />} />
        <Route path="/form" element={<Form />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/tablet" element={<Tablet />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/crm" element={<CRMSearch />} />
        <Route path="/crm/:id" element={<CustomerProfile />} />
      </Routes>
    </RootLayout>
  );
}
