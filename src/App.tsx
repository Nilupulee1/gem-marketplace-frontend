import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import SellerDashboard from './components/seller/SellerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import BuyerDashboard from './components/buyer/BuyerDashboard';
import { UserRole } from './types';
import { Container, Row, Col } from 'react-bootstrap';
import { ShieldCheck, BadgeCheck, Gavel } from 'lucide-react';
import heroImage from './assets/diamond.jpg';

// Placeholder components
const HomePage = () => (
  <>
    <Container fluid className="pt-4 px-0">
      <Container>
        <section className="home-hero position-relative animate-fade-up">
          <img
            src={heroImage}
            alt="Certified gemstone marketplace"
            className="position-absolute w-100 h-100"
            style={{ objectFit: 'cover', opacity: 0.35 }}
          />
          <div className="home-hero-overlay position-relative p-4 p-md-5">
            <span className="hero-eyebrow mb-3">Certified and Admin-Verified Marketplace</span>
            <h1 className="hero-title mb-3">
              The Trusted Marketplace for <span className="accent">Certified Gemstones</span>
            </h1>
            <p className="hero-copy mb-4">
              Buy, sell, and showcase authenticated gemstones with confidence. Every listing is
              reviewed, every certificate is verified, and every transaction stays transparent.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary btn-lg px-4">
                Start Exploring
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                Sign In
              </Link>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-4">
              <span className="status-pill approved">Verified Sellers</span>
              <span className="status-pill info">Traceable Certificates</span>
              <span className="status-pill warning">Secure Bidding</span>
            </div>
          </div>
        </section>
      </Container>
    </Container>

    <Container className="py-5">
      <div className="text-center mb-4 animate-fade-up delay-1">
        <h2 className="mb-3">Why GemFolio Stands Apart</h2>
        <p className="text-secondary mb-0">Built for transparency, trust, and premium gemstone trading.</p>
      </div>
      <Row className="g-4">
        <Col md={4}>
          <div className="feature-card p-4 animate-fade-up delay-1">
            <ShieldCheck size={20} className="mb-3 text-primary" />
            <h5 className="mb-2">Admin Verification</h5>
            <p className="mb-0">Each gem is manually reviewed before it appears in the marketplace.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="feature-card p-4 animate-fade-up delay-2">
            <BadgeCheck size={20} className="mb-3 text-primary" />
            <h5 className="mb-2">Certificate Validation</h5>
            <p className="mb-0">Listings include accreditation details from recognized authorities.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="feature-card p-4 animate-fade-up delay-3">
            <Gavel size={20} className="mb-3 text-primary" />
            <h5 className="mb-2">Live Auction Integrity</h5>
            <p className="mb-0">Structured auction rules and transparent bidding for every buyer.</p>
          </div>
        </Col>
      </Row>
      <Row className="g-4 mt-2">
        <Col md={4}>
          <div className="info-tile p-4 text-center">
            <div className="tile-value">100%</div>
            <div className="tile-label">Verified Listings</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="info-tile p-4 text-center">
            <div className="tile-value">24/7</div>
            <div className="tile-label">Marketplace Access</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="info-tile p-4 text-center">
            <div className="tile-value">Secure</div>
            <div className="tile-label">Transaction Pipeline</div>
          </div>
        </Col>
      </Row>
    </Container>
  </>
);

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <div className="min-vh-100 market-shell">
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