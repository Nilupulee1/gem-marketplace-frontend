import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types';
import { LogOut } from 'lucide-react';
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
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand 
          href="/" 
          onClick={handleBrandClick}
          className="d-flex align-items-center"
        >
          
        <img 
            src={logo} 
            alt="GemFolio Logo" 
            style={{ height: '65px' }} 
        />
        <span className="fw-bold fs-2 mb-1">GemFolio</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link 
                  href={getDashboardLink()} 
                  onClick={handleDashboardClick}
                  className="me-3"
                >
                  Dashboard
                </Nav.Link>
                <span className="text-muted me-3 d-none d-md-inline">
                  {user?.name} ({user?.role})
                </span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="d-flex align-items-center"
                >
                  <LogOut size={16} className="me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="link"
                  className="me-2 text-decoration-none"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Register
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