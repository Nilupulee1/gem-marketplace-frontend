import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, Nav, Button, Table, Form, InputGroup } from 'react-bootstrap';
import { LayoutDashboard, Gavel, Heart, History, Search, Eye } from 'lucide-react';

type BuyerTab = 'overview' | 'auctions' | 'watchlist' | 'history';

interface WatchlistGem {
  id: string;
  name: string;
  origin: string;
  currentBid: number;
  status: 'active' | 'ended';
}

interface BidItem {
  id: string;
  gemName: string;
  amount: number;
  timeLeft: string;
  status: 'leading' | 'outbid' | 'won';
}

const watchlistData: WatchlistGem[] = [
  { id: 'g1', name: 'Ceylon Blue Sapphire', origin: 'Sri Lanka', currentBid: 125000, status: 'active' },
  { id: 'g2', name: 'Colombian Emerald', origin: 'Colombia', currentBid: 98000, status: 'active' },
  { id: 'g3', name: 'Ruby Pigeon Blood', origin: 'Myanmar', currentBid: 210000, status: 'ended' },
];

const bidData: BidItem[] = [
  { id: 'b1', gemName: 'Ceylon Blue Sapphire', amount: 125000, timeLeft: '03h 14m', status: 'leading' },
  { id: 'b2', gemName: 'Padparadscha Sapphire', amount: 89000, timeLeft: '01h 10m', status: 'outbid' },
  { id: 'b3', gemName: 'Natural Alexandrite', amount: 145000, timeLeft: 'Auction Ended', status: 'won' },
];

const formatCurrency = (value: number) => `Rs.${value.toLocaleString()}`;

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState<BuyerTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWatchlist = useMemo(
    () => watchlistData.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const renderStatus = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-pill active">Active</span>;
      case 'ended':
        return <span className="status-pill ended">Ended</span>;
      case 'leading':
        return <span className="status-pill approved">Leading</span>;
      case 'outbid':
        return <span className="status-pill warning">Outbid</span>;
      case 'won':
        return <span className="status-pill verified">Won</span>;
      default:
        return <span className="status-pill default">-</span>;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'auctions':
        return (
          <Card className="content-card animate-fade-up">
            <Card.Body className="p-4">
              <div className="dashboard-title">
                <h4 className="fw-bold">Live Auctions</h4>
                <p>Track your bids and current auction positions in real time.</p>
              </div>
              <div className="table-responsive">
                <Table hover className="align-middle surface-table mb-0">
                  <thead>
                    <tr>
                      <th>Auction</th>
                      <th>Your Bid</th>
                      <th>Time Remaining</th>
                      <th>Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bidData.map((bid) => (
                      <tr key={bid.id}>
                        <td className="fw-semibold">{bid.gemName}</td>
                        <td>{formatCurrency(bid.amount)}</td>
                        <td>{bid.timeLeft}</td>
                        <td>{renderStatus(bid.status)}</td>
                        <td className="text-center">
                          <Button size="sm" variant="outline-primary">
                            <Eye size={14} className="me-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        );
      case 'watchlist':
        return (
          <Card className="content-card animate-fade-up">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="dashboard-title mb-0">
                  <h4 className="fw-bold">Watchlist</h4>
                  <p>Curated gems you are tracking before placing bids.</p>
                </div>
                <InputGroup style={{ maxWidth: '320px' }}>
                  <InputGroup.Text className="bg-white">
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search watchlist"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <Row className="g-3">
                {filteredWatchlist.map((item) => (
                  <Col md={6} xl={4} key={item.id}>
                    <Card className="surface-muted h-100">
                      <Card.Body>
                        <h6 className="fw-semibold mb-2">{item.name}</h6>
                        <small className="text-muted d-block mb-1">Origin: {item.origin}</small>
                        <small className="text-muted d-block mb-3">Current Bid: {formatCurrency(item.currentBid)}</small>
                        <div className="d-flex justify-content-between align-items-center">
                          {renderStatus(item.status)}
                          <Button size="sm" variant="outline-primary">Open</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        );
      case 'history':
        return (
          <Card className="content-card animate-fade-up">
            <Card.Body className="p-4">
              <div className="dashboard-title">
                <h4 className="fw-bold">Transaction History</h4>
                <p>View your concluded auctions and purchase records.</p>
              </div>
              <div className="table-responsive">
                <Table hover className="align-middle surface-table mb-0">
                  <thead>
                    <tr>
                      <th>Gemstone</th>
                      <th>Final Amount</th>
                      <th>Result</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Natural Alexandrite</td>
                      <td>{formatCurrency(145000)}</td>
                      <td>{renderStatus('won')}</td>
                      <td>Apr 09, 2026</td>
                    </tr>
                    <tr>
                      <td>Madagascar Ruby</td>
                      <td>{formatCurrency(110000)}</td>
                      <td>{renderStatus('outbid')}</td>
                      <td>Apr 03, 2026</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        );
      default:
        return (
          <>
            <div className="dashboard-title animate-fade-up">
              <h4 className="fw-bold">Buyer Overview</h4>
              <p>Monitor bids, watchlist opportunities, and active auctions from one workspace.</p>
            </div>
            <Row className="g-4 mb-4">
              <Col md={4}>
                <Card className="stat-card h-100 animate-fade-up delay-1">
                  <Card.Body>
                    <small className="text-muted">Active Bids</small>
                    <h3 className="mb-1 mt-2">8</h3>
                    <span className="status-pill approved">2 Leading</span>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stat-card h-100 animate-fade-up delay-2">
                  <Card.Body>
                    <small className="text-muted">Watchlist Gems</small>
                    <h3 className="mb-1 mt-2">14</h3>
                    <span className="status-pill info">5 Ending Soon</span>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stat-card h-100 animate-fade-up delay-3">
                  <Card.Body>
                    <small className="text-muted">Completed Purchases</small>
                    <h3 className="mb-1 mt-2">6</h3>
                    <span className="status-pill verified">Verified Receipts</span>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="content-card animate-fade-up">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Recent Bid Activity</h5>
                  <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('auctions')}>
                    View All
                  </Button>
                </div>
                <div className="table-responsive">
                  <Table hover className="align-middle surface-table mb-0">
                    <thead>
                      <tr>
                        <th>Gemstone</th>
                        <th>Your Bid</th>
                        <th>Time Left</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bidData.slice(0, 3).map((bid) => (
                        <tr key={bid.id}>
                          <td className="fw-semibold">{bid.gemName}</td>
                          <td>{formatCurrency(bid.amount)}</td>
                          <td>{bid.timeLeft}</td>
                          <td>{renderStatus(bid.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </>
        );
    }
  };

  return (
    <Container fluid className="dashboard-shell">
      <Row className="g-0">
        <Col lg={2} className="pe-lg-3">
          <Card className="sidebar-card mb-4">
            <Card.Body className="text-center py-4">
              <div
                className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{ width: '80px', height: '80px' }}
              >
                <span className="display-6">💎</span>
              </div>
              <h6 className="mb-1">Buyer Workspace</h6>
              <span className="profile-chip">Verified Buyer</span>
            </Card.Body>
          </Card>

          <Nav className="flex-column">
            <Nav.Link className={`sidebar-nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <LayoutDashboard size={18} /> Overview
            </Nav.Link>
            <Nav.Link className={`sidebar-nav-link ${activeTab === 'auctions' ? 'active' : ''}`} onClick={() => setActiveTab('auctions')}>
              <Gavel size={18} /> Live Auctions
            </Nav.Link>
            <Nav.Link className={`sidebar-nav-link ${activeTab === 'watchlist' ? 'active' : ''}`} onClick={() => setActiveTab('watchlist')}>
              <Heart size={18} /> Watchlist
            </Nav.Link>
            <Nav.Link className={`sidebar-nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
              <History size={18} /> History
            </Nav.Link>
          </Nav>
        </Col>

        <Col lg={10}>{renderContent()}</Col>
      </Row>
    </Container>
  );
};

export default BuyerDashboard;
