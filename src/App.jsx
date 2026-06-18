import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import Scan from './pages/Scan';
import BookingWizard from './components/BookingWizard';
import Form from './pages/Form';
import Confirm from './pages/Confirm';
import Services from './pages/Services';
import TrackPage from './pages/TrackPage';
import ReviewPage from './pages/ReviewPage';
import Reviews from './pages/Reviews';
import CRMSearch from './pages/CRMSearch';
import CustomerProfile from './pages/CustomerProfile';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import AuthGuard from './components/AuthGuard';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import CustomerLayout from './components/CustomerLayout';

export default function App() {
  return (
    <TenantProvider>
      <Routes>
        <Route path="/" element={<CustomerLayout><Landing /></CustomerLayout>} />
        <Route path="/book" element={<CustomerLayout><BookingWizard /></CustomerLayout>} />
        <Route path="/track" element={<CustomerLayout><TrackPage /></CustomerLayout>} />
        <Route path="/review" element={<CustomerLayout><ReviewPage /></CustomerLayout>} />
        <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
        <Route path="/onboarding" element={<CustomerLayout><Onboarding /></CustomerLayout>} />
        <Route path="/dashboard/*" element={
          <AuthGuard><DashboardLayout /></AuthGuard>
        } />
        <Route path="/scan" element={<Scan />} />
        <Route path="/form" element={<Form />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/crm" element={<CRMSearch />} />
        <Route path="/crm/:id" element={<CustomerProfile />} />
      </Routes>
    </TenantProvider>
  );
}
