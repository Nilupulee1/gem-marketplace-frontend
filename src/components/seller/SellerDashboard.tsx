import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Badge, ListGroup } from 'react-bootstrap';
import { useAuthStore } from '../../store/authStore';
import { gemAPI } from '../../api/axios';
import { Gem as GemIcon, TrendingUp, Package, AlertCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MyPortfolio from './MyPortfolio';
import AddGemForm from './AddGemForm';
import AuctionsPage from './Auctions';
import type { Gem } from "../../types";


type TabType = 'dashboard' | 'portfolio' | 'auctions' | 'addGem';

const SellerDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [myGems, setMyGems] = useState<Gem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalValue: 0,
    activeListings: 0,
    pendingVerification: 0,
  });

  useEffect(() => {
    fetchMyGems();
  }, []);

  const fetchMyGems = async () => {
    try {
      setLoading(true);
      const response = await gemAPI.getMyGems();
      const gems = response.data.gems;
      setMyGems(gems);

      // Calculate stats
      const approved = gems.filter((g: Gem) => g.status === 'approved');
      const pending = gems.filter((g: Gem) => g.status === 'pending');
      
      setStats({
        totalValue: 63500, // This would be calculated from actual gem values
        activeListings: approved.length,
        pendingVerification: pending.length,
      });
    } catch (error) {
      console.error('Error fetching gems:', error);
    } finally {
      setLoading(false);
    }
  };

  const recentActivities = [
    {
      type: 'success',
      icon: '✓',
      message: 'Your "Royal Blue Tanzanite" has been approved.',
      time: '2 hours ago',
    },
    {
      type: 'info',
      icon: 'i',
      message: 'New bid of ₨.12,500 on your "Sunset Padparadscha"',
      time: '1 day ago',
    },
    {
      type: 'danger',
      icon: '✕',
      message: 'Listing for "Rough Diamond Cluster" was rejected.',
      time: '3 days ago',
    },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return <MyPortfolio gems={myGems} onRefresh={fetchMyGems} />;
      case 'auctions':
        return <AuctionsPage />;
      case 'addGem':
        return <AddGemForm onSuccess={() => {
          fetchMyGems();
          setActiveTab('portfolio');
        }} />;
      default:
        return (
          <>
            {/* Welcome Section */}
            <div className="dashboard-title">
              <h4 className="mb-1">Welcome back, {user?.name?.split(' ')[0]}</h4>
              <p className="text-muted">Here's a summary of your gem portfolio and recent activity.</p>
            </div>

            {/* Stats Cards */}
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="stat-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <p className="text-muted mb-1 small">Total Portfolio Value</p>
                        <h3 className="mb-0">Rs.{stats.totalValue.toLocaleString()}</h3>
                      </div>
                      <div className="stat-icon bg-primary bg-opacity-10">
                        <TrendingUp className="text-primary" size={24} />
                      </div>
                    </div>
                    <small className="text-success">↑ 12.5%</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="stat-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <p className="text-muted mb-1 small">Active Listings</p>
                        <h3 className="mb-0">{stats.activeListings}</h3>
                      </div>
                      <div className="stat-icon bg-success bg-opacity-10">
                        <Package className="text-success" size={24} />
                      </div>
                    </div>
                    <small className="text-muted">out of {myGems.length} gems</small>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="stat-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <p className="text-muted mb-1 small">Pending Verification</p>
                        <h3 className="mb-0">{stats.pendingVerification}</h3>
                      </div>
                      <div className="stat-icon bg-warning bg-opacity-10">
                        <AlertCircle className="text-warning" size={24} />
                      </div>
                    </div>
                    <small className="text-muted">awaiting admin review</small>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* My Listings Section */}
            <Row>
              <Col lg={8}>
                <Card className="content-card mb-4">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">My Listings</h5>
                      <div>
                        <Button 
                          variant="link" 
                          size="sm"
                          className={`me-2 ${activeTab === 'dashboard' ? 'text-primary' : 'text-muted'}`}
                        >
                          Pending
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                        >
                          Approved
                        </Button>
                        <Button 
                          variant="link" 
                          size="sm"
                          className="ms-2 text-muted"
                        >
                          Rejected
                        </Button>
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : myGems.length === 0 ? (
                      <div className="text-center py-5">
                        <GemIcon size={48} className="text-muted mb-3" />
                        <p className="text-muted">No gems added yet</p>
                        <Button 
                          variant="primary"
                          onClick={() => setActiveTab('addGem')}
                        >
                          <Plus size={16} className="me-1" />
                          Add Your First Gem
                        </Button>
                      </div>
                    ) : (
                      <Row className="g-3">
                        {myGems.slice(0, 4).map((gem) => (
                          <Col md={6} key={gem._id}>
                            <Card className="surface-muted">
                              <div 
                                className="position-relative"
                                style={{ height: '200px', overflow: 'hidden' }}
                              >
                                <img
                                  src={gem.images[0] || 'https://via.placeholder.com/300x200'}
                                  alt={gem.type}
                                  className="w-100 h-100"
                                  style={{ objectFit: 'cover' }}
                                />
                                <Badge 
                                  bg={gem.status === 'approved' ? 'success' : gem.status === 'pending' ? 'warning' : 'danger'}
                                  className="position-absolute top-0 end-0 m-2"
                                >
                                  {gem.status}
                                </Badge>
                              </div>
                              <Card.Body>
                                <h6 className="mb-1">{gem.type}</h6>
                                <p className="text-muted small mb-2">
                                  Carat: {gem.carat} | Origin: {gem.origin}
                                </p>
                                <div className="d-flex justify-content-between">
                                  <Button variant="outline-primary" size="sm">
                                    View Details
                                  </Button>
                                  <Button variant="outline-secondary" size="sm">
                                    Edit
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* Recent Activity */}
              <Col lg={4}>
                <Card className="content-card">
                  <Card.Body>
                    <h5 className="mb-3">Recent Activity</h5>
                    <ListGroup variant="flush">
                      {recentActivities.map((activity, index) => (
                        <ListGroup.Item key={index} className="px-0">
                          <div className="d-flex align-items-start">
                            <div 
                              className={`me-2 rounded-circle d-flex align-items-center justify-content-center ${
                                activity.type === 'success' ? 'bg-success-subtle' : 
                                activity.type === 'info' ? 'bg-info-subtle' : 'bg-danger-subtle'
                              }`}
                              style={{ width: '32px', height: '32px', minWidth: '32px' }}
                            >
                              <span className={`text-${activity.type}`}>{activity.icon}</span>
                            </div>
                            <div className="flex-grow-1">
                              <p className="mb-1 small">{activity.message}</p>
                              <small className="text-muted">{activity.time}</small>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  return (
    <Container fluid className="dashboard-shell">
      <Row className="g-0">
        {/* Sidebar */}
        <Col lg={2} className="pe-lg-3">
          <Card className="sidebar-card mb-4">
            <Card.Body className="text-center py-4">
              <div 
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: '80px', height: '80px' }}
              >
                <span className="display-6">👤</span>
              </div>
              <h6 className="mb-1">{user?.name}</h6>
              <span className="profile-chip">Collector</span>
            </Card.Body>
          </Card>

          <Nav className="flex-column">
            <Nav.Link
              className={`sidebar-nav-link ${
                activeTab === 'dashboard' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              <GemIcon size={18} className="me-2" />
              Dashboard
            </Nav.Link>
            <Nav.Link
              className={`sidebar-nav-link ${
                activeTab === 'portfolio' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Package size={18} className="me-2" />
              My Portfolio
            </Nav.Link>
            <Nav.Link
              className={`sidebar-nav-link ${
                activeTab === 'auctions' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('auctions')}
            >
              <TrendingUp size={18} className="me-2" />
              Auctions
            </Nav.Link>
            <Nav.Link
              className={`sidebar-nav-link ${
                activeTab === 'addGem' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('addGem')}
            >
              <Plus size={18} className="me-2" />
              Add New Gem
            </Nav.Link>
          </Nav>

          <hr className="my-4" />

          <Button variant="outline-secondary" size="sm" className="w-100">
            <AlertCircle size={16} className="me-2" />
            Settings
          </Button>
          <Button variant="outline-danger" size="sm" className="w-100 mt-2" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Col>

        {/* Main Content */}
        <Col lg={10}>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default SellerDashboard;