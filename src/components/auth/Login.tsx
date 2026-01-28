import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../api/axios';
import { Eye, EyeOff } from 'lucide-react';
import { AxiosError } from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import diamond from '../../assets/diamond.jpg';
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
        {/* Left Side - Image/Design */}
        
        <Col lg={6} className="d-none d-lg-block auth-left position-relative ">
          {/* Animated Diamonds */}
          

          <img 
            src={diamond} 
            alt="Diamond Background" 
            className="position-absolute w-100 h-100"
            style={{ objectFit: 'cover', opacity: 0.2 }}
          />
        </Col>

        {/* Right Side - Form */}
        <Col lg={6} className="d-flex align-items-center justify-content-center p-4 bg-white">
          <div style={{ maxWidth: '450px', width: '100%' }}>
            {/* Logo */}
            <div className="text-center mb-5">
              
              <h1 className="h1 fw-bold text-dark">Sign In</h1>
              <p className="text-muted">
                Welcome back! Please enter your details.
              </p>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  size="lg"
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
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
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                size="lg"
                className="w-100 fw-semibold shadow"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>

            {/* Register Link */}
            <p className="text-center text-muted mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                Sign Up
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;