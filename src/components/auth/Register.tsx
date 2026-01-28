import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authAPI } from '../../api/axios';
import { Eye, EyeOff, Gem } from 'lucide-react';
import { UserRole } from '../../types';
import { AxiosError } from 'axios';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

// Import images
import diamond from '../../assets/diamond.webp';


const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: UserRole.BUYER as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await authAPI.register(registerData);
      const { user, token } = response.data;
      setAuth(user, token);

      switch (user.role) {
        case UserRole.SELLER:
          navigate('/seller');
          break;
        case UserRole.BUYER:
          navigate('/buyer');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-container p-0">
      <Row className="g-0 min-vh-100">
        {/* Left Side - Background Design */}
        <Col lg={6} className="d-none d-lg-block auth-left position-relative">
          {/* Diamond background */}
          <img 
            src={diamond} 
            alt="Diamond Background" 
            className="position-absolute w-100 h-100"
            style={{ objectFit: 'cover', opacity: 0.2 }}
          />

          <div className="position-relative h-100 d-flex align-items-center justify-content-center text-white">
            <div className="text-center p-5">
              <Gem size={80} className="mb-4 floating-diamond" />
              <h1 className="display-4 fw-bold mb-3">Welcome to GemFolio</h1>
              <p className="lead">
                Buy, sell, and verify authentic gems securely
              </p>
            </div>
          </div>
        </Col>

        {/* Right Side - Form */}
        <Col lg={6} className="d-flex align-items-center justify-content-center p-4 bg-white">
          <div style={{ maxWidth: '500px', width: '100%' }}>
            {/* Logo */}
            <div className="text-center mb-4">
              
             
              <h2 className="h3 fw-bold text-dark">Create an Account</h2>
              <p className="text-muted">
                Create your account to buy, sell, or verify authentic gems securely.
              </p>
            </div>

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              {/* First Name */}
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                  size="lg"
                />
              </Form.Group>

              {/* Last Name */}
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                  size="lg"
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  size="lg"
                />
              </Form.Group>

              {/* Password */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    required
                    size="lg"
                  />
                  <Button
                    variant="link"
                    className="position-absolute end-0 top-50 translate-middle-y text-muted"
                    style={{ zIndex: 10, textDecoration: 'none' }}
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                </div>
                <Form.Text className="text-muted">
                  Must be at least 8 characters.
                </Form.Text>
              </Form.Group>

              {/* Role Selection */}
              <Form.Group className="mb-4">
                <Form.Label>Select your role</Form.Label>
                <Row className="g-3">
                  <Col xs={6}>
                    <div
                      className={`role-button p-3 rounded text-center border ${
                        formData.role === UserRole.BUYER ? 'active' : ''
                      }`}
                      onClick={() => handleRoleChange(UserRole.BUYER)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleRoleChange(UserRole.BUYER);
                        }
                      }}
                    >
                      <strong>Buyer</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div
                      className={`role-button p-3 rounded text-center border ${
                        formData.role === UserRole.SELLER ? 'active' : ''
                      }`}
                      onClick={() => handleRoleChange(UserRole.SELLER)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleRoleChange(UserRole.SELLER);
                        }
                      }}
                    >
                      <strong>Collector/Seller</strong>
                    </div>
                  </Col>
                </Row>
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                size="lg"
                className="w-100 fw-semibold shadow"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </Form>

            {/* Sign In Link */}
            <p className="text-center text-muted mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Sign In
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
