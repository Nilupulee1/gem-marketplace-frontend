import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SellerDashboard from './components/seller/SellerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { UserRole } from './types';
import { Container } from 'react-bootstrap';

// Placeholder components
const HomePage = () => (
  <Container className="py-5 text-center">
    <h1 className="display-4 mb-4">Welcome to GemMarket</h1>
    <p className="lead mb-4">Your trusted platform for authentic gem trading</p>
    <div className="d-flex gap-3 justify-content-center">
      <a href="/register" className="btn btn-primary btn-lg">Get Started</a>
      <a href="/login" className="btn btn-outline-primary btn-lg">Sign In</a>
    </div>
  </Container>
);

const BuyerDashboard = () => (
  <Container className="py-5">
    <h1>Buyer Dashboard - Coming Soon</h1>
  </Container>
);

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/seller/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.SELLER]}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/buyer/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.BUYER]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;