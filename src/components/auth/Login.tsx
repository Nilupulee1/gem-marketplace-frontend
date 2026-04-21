import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../api/axios';
import { Eye, EyeOff } from 'lucide-react';
import { AxiosError } from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import diamond from '../../assets/diamond.jpg';
import logo from '../../assets/logo.png';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      setAuth(user, token);

      switch (user.role) {
        case 'seller':
          navigate('/seller');
          break;
        case 'buyer':
          navigate('/buyer');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container p-0">
      <Row className="g-0 min-vh-100">
        <Col lg={6} className="d-none d-lg-flex align-items-center auth-panel position-relative overflow-hidden">
          <img 
            src={diamond} 
            alt="Diamond Background" 
            className="position-absolute w-100 h-100"
            style={{ objectFit: 'cover', opacity: 0.35 }}
          />
          <div className="auth-side-content">
            <p className="hero-eyebrow mb-3">Buyer and Seller Access</p>
            <h1 className="mb-3" style={{ fontSize: '2.6rem', lineHeight: 1.2 }}>
              Secure Sign In for the GemFolio Marketplace
            </h1>
            <p className="mb-0" style={{ color: '#cad4df', fontSize: '1.05rem' }}>
              Continue to your verified account and manage listings, bidding, and portfolio data in one place.
            </p>
          </div>
        </Col>

        <Col lg={6} className="d-flex align-items-center justify-content-center p-4 p-md-5 bg-white">
          <div className="auth-form-wrap">
            <div className="text-center mb-4">
              <img src={logo} alt="GemFolio" style={{ height: '58px' }} />
              <h1 className="h2 fw-bold mt-2 mb-2" style={{ color: '#1c2a3b' }}>Sign In</h1>
              <p className="mb-0" style={{ color: '#687585' }}>
                Welcome back! Please enter your details.
              </p>
            </div>

            <div className="auth-card p-4 p-md-5">
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold" style={{ color: '#2f3d4f' }}>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    size="lg"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold" style={{ color: '#2f3d4f' }}>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      size="lg"
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y text-muted"
                      style={{ zIndex: 10 }}
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 fw-semibold"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>

              <p className="text-center mt-4 mb-0" style={{ color: '#647182' }}>
                Don't have an account?{' '}
                <Link to="/register" className="fw-semibold text-decoration-none">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;