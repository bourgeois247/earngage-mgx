import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Creator Pages
import CreatorDashboard from './pages/Creator/Dashboard';
import CreatorProfile from './pages/Creator/Profile';
import CampaignDiscovery from './pages/Creator/CampaignDiscovery';

// Brand Pages
import BrandDashboard from './pages/Brand/Dashboard';
import BrandProfile from './pages/Brand/Profile';
import CampaignCreation from './pages/Brand/CampaignCreation';

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
  const { currentUser, userProfile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (userType && userProfile?.userType !== userType) {
    return <Navigate to={`/${userProfile?.userType.toLowerCase()}/dashboard`} replace />;
  }
  
  return children;
};

// Import the useAuth hook from AuthContext
import { useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Creator Routes */}
              <Route 
                path="/creator/dashboard" 
                element={
                  <ProtectedRoute userType="creator">
                    <CreatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator/profile" 
                element={
                  <ProtectedRoute userType="creator">
                    <CreatorProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator/discover" 
                element={
                  <ProtectedRoute userType="creator">
                    <CampaignDiscovery />
                  </ProtectedRoute>
                } 
              />
              
              {/* Brand Routes */}
              <Route 
                path="/brand/dashboard" 
                element={
                  <ProtectedRoute userType="brand">
                    <BrandDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/brand/profile" 
                element={
                  <ProtectedRoute userType="brand">
                    <BrandProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/brand/campaigns/create" 
                element={
                  <ProtectedRoute userType="brand">
                    <CampaignCreation />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch All Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;