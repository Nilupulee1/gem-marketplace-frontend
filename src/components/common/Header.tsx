import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import { LogOut, Home } from 'lucide-react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import logo from '../../assets/logo.png';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case UserRole.SELLER:
        return '/seller';
      case UserRole.BUYER:
        return '/buyer';
      case UserRole.ADMIN:
        return '/admin';
      default:
        return '/';
    }
  };

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(getDashboardLink());
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="market-navbar py-2">
      <Container>
        <Navbar.Brand 
          href="/" 
          onClick={handleBrandClick}
          className="d-flex align-items-center gap-2"
        >
          <img 
            src={logo} 
            alt="GemFolio Logo" 
            style={{ height: '54px' }} 
          />
          <span className="brand-wordmark">GemFolio</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Nav.Link 
                  href={getDashboardLink()} 
                  onClick={handleDashboardClick}
                  className="nav-link-clean d-flex align-items-center gap-1"
                >
                  <Home size={16} />
                  Dashboard
                </Nav.Link>
                <span
                  className="d-none d-md-inline px-3 py-2 rounded-2"
                  style={{ background: '#eef2f6', color: '#425061', fontWeight: 600, border: '1px solid #d9e3ee' }}
                >
                  {user?.name} ({user?.role.toUpperCase()})
                </span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-1"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link href="#" className="nav-link-clean d-none d-lg-block">Features</Nav.Link>
                <Nav.Link href="#" className="nav-link-clean d-none d-lg-block">How It Works</Nav.Link>
                <Nav.Link href="#" className="nav-link-clean d-none d-lg-block">Security</Nav.Link>
                <Button
                  variant="link"
                  className="text-decoration-none nav-link-clean"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;