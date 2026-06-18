import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const isAuthed = localStorage.getItem('salon_authed');
  
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
