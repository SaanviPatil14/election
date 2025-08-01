// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import useAuth
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirectWrapper from './components/AuthRedirectWrapper'; // Import the new wrapper

// Import all pages
import LandingPage from './pages/LandingPage'; // The new overall dashboard
import CommonLogin from './components/CommonLogin'; // Now on a specific route
import AdminLogin from './pages/AdminLogin';
import VoterDashboard from './pages/VoterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ElectionResults from './pages/ElectionResults';
import NotFound from './pages/NotFound';

function App() {
  const RootPathHandler = () => {
    const { user, userType, loading } = useAuth();
  
    if (loading) {
      return (
        <div className="min-h-screen bg-light-grey flex items-center justify-center">
          <p className="text-blue-600 text-2xl font-semibold animate-pulse">Loading authentication...</p>
        </div>
      );
    }
  
    if (user) {
      if (userType === 'voter') {
        return <Navigate to="/voter-dashboard" replace />;
      }
      if (userType === 'candidate') {
        return <Navigate to="/candidate-dashboard" replace />;
      }
      if (userType === 'admin') {
        return <Navigate to="/admin-dashboard" replace />;
      }
      return <Navigate to="/auth-portal" replace />;
    }
    return <LandingPage />;
  };
  

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootPathHandler />} />
          <Route path="/auth-portal" element={<CommonLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/public-results" element={<ElectionResults />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['voter']} />}>
            <Route path="/voter-dashboard" element={<VoterDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/election-results" element={<ElectionResults />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;