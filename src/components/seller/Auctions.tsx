import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Table, Badge, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { Search, Download, Plus, Eye, Trash2 } from 'lucide-react';
import type { Gem } from '../../types';
import { gemAPI, auctionAPI } from '../../api/axios';
import CreateAuctionModal from './CreateAuctionModal';

interface Auction {
  _id: string;
  gem: {
    _id: string;
    type: string;
    images: string[];
    certificate: {
      certificateNumber: string;
    };
  };
  winner?: {
    name: string;
  };
  endTime: string;
  currentBid: number;
  status: string;
}

const AuctionsPage = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [myGems, setMyGems] = useState<Gem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGem, setSelectedGem] = useState<Gem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('End date');
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchAuctions();
    fetchMyGems();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await auctionAPI.getActiveAuctions();
      setAuctions(response.data.auctions || []);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGems = async () => {
    try {
      const response = await gemAPI.getMyGems();
      const approvedGems = response.data.gems.filter((gem: Gem) => gem.status === 'approved');
      setMyGems(approvedGems);
    } catch (error) {
      console.error('Error fetching gems:', error);
    }
  };

  const handleAuctionCreated = () => {
    setShowCreateModal(false);
    setSelectedGem(null);
    fetchAuctions();
  };

  const handleViewDetails = (auction: Auction) => {
    console.log('View auction details:', auction);
    alert('View auction details - Coming soon!');
  };

  const handleDelete = (auction: Auction) => {
    setSelectedAuction(auction);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAuction) return;

    try {
      console.log('Delete auction:', selectedAuction._id);
      alert('Delete functionality will be implemented with backend API');
      setShowDeleteModal(false);
      setSelectedAuction(null);
      fetchAuctions();
    } catch (error) {
      console.error('Error deleting auction:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge bg="success" className="px-3">Active</Badge>;
      case 'ended':
        return <Badge bg="secondary" className="px-3">Ended</Badge>;
      case 'cancelled':
        return <Badge bg="danger" className="px-3">Canceled</Badge>;
      default:
        return <Badge bg="info" className="px-3">Active</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const formatCurrency = (amount: number) => {
    return `Rs.${amount.toLocaleString()}`;
  };

  // Mock data for demonstration (remove when real data is available)
  const mockAuctions: Auction[] = [
    {
      _id: '1',
      gem: {
        _id: '1',
        type: 'Burmese Sapphire',
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'],
        certificate: { certificateNumber: 'RT #123456' }
      },
      winner: { name: 'Erin Lewis' },
      endTime: '2025-05-12',
      currentBid: 550000,
      status: 'active'
    },
    {
      _id: '2',
      gem: {
        _id: '2',
        type: 'Ceylon Sapphire',
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
        certificate: { certificateNumber: 'RT #123457' }
      },
      winner: { name: 'John Doe' },
      endTime: '2025-05-15',
      currentBid: 650000,
      status: 'active'
    },
    {
      _id: '3',
      gem: {
        _id: '3',
        type: 'Ruby Stone',
        images: ['https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=400'],
        certificate: { certificateNumber: 'RT #123458' }
      },
      winner: { name: 'Sarah Smith' },
      endTime: '2025-05-20',
      currentBid: 450000,
      status: 'ended'
    },
    {
      _id: '4',
      gem: {
        _id: '4',
        type: 'Emerald Green',
        images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400'],
        certificate: { certificateNumber: 'RT #123459' }
      },
      endTime: '2025-05-18',
      currentBid: 750000,
      status: 'active'
    }
  ];

  const displayAuctions = auctions.length > 0 ? auctions : mockAuctions;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold">Auctions</h2>
          <p className="text-muted mb-0">Review all your past auctions</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center px-4"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} className="me-2" />
          Create Auction
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          {/* Filters and Search */}
          <Row className="mb-4 align-items-center">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by gem name, auction ID or winner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={7} className="d-flex gap-3 justify-content-end mt-3 mt-md-0">
              <Form.Select 
                style={{ width: 'auto' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option>Role: All</option>
                <option>Seller</option>
                <option>Buyer</option>
              </Form.Select>
              <Form.Select 
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Status: All</option>
                <option>Active</option>
                <option>Ended</option>
                <option>Canceled</option>
              </Form.Select>
              <Form.Select 
                style={{ width: 'auto' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Sort By: End date</option>
                <option>Sort By: Start date</option>
                <option>Sort By: Bid amount</option>
              </Form.Select>
              <Button variant="primary" className="d-flex align-items-center">
                <Download size={16} className="me-2" />
                Export as CSV
              </Button>
            </Col>
          </Row>

          {/* Auctions Table */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : displayAuctions.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-3">No auctions found</p>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create Your First Auction
              </Button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3">Gem Details</th>
                      <th className="border-0 py-3">Winner</th>
                      <th className="border-0 py-3">Auction End Date</th>
                      <th className="border-0 py-3">Final Bid</th>
                      <th className="border-0 py-3 text-center">Action</th>
                      <th className="border-0 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayAuctions.map((auction) => (
                      <tr key={auction._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded me-3"
                              style={{ 
                                width: '50px', 
                                height: '50px',
                                backgroundColor: '#f0f0f0',
                                overflow: 'hidden'
                              }}
                            >
                              <img 
                                src={auction.gem?.images?.[0] || 'https://via.placeholder.com/50'}
                                alt={auction.gem?.type}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://via.placeholder.com/50';
                                }}
                              />
                            </div>
                            <div>
                              <div className="fw-semibold">{auction.gem?.type || 'Burmese Sapphire'}</div>
                              <small className="text-muted">
                                {auction.gem?.certificate?.certificateNumber || 'RT #123456'}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{auction.winner?.name || '-'}</td>
                        <td>{formatDate(auction.endTime)}</td>
                        <td className="fw-semibold">{formatCurrency(auction.currentBid)}</td>
                        <td className="text-center">
                          <div className="d-flex gap-2 justify-content-center">
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-1 text-success"
                              title="View Details"
                              onClick={() => handleViewDetails(auction)}
                            >
                              <Eye size={18} />
                            </Button>
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="p-1 text-danger"
                              title="Delete"
                              onClick={() => handleDelete(auction)}
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </td>
                        <td>{getStatusBadge(auction.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">Showing 1-{displayAuctions.length} of {displayAuctions.length}</small>
                <Pagination className="mb-0">
                  <Pagination.Prev disabled />
                  <Pagination.Item active>{1}</Pagination.Item>
                  <Pagination.Item>{2}</Pagination.Item>
                  <Pagination.Item>{3}</Pagination.Item>
                  <Pagination.Next />
                </Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      {/* Create Auction Modal */}
      <CreateAuctionModal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setSelectedGem(null);
        }}
        selectedGem={selectedGem}
        availableGems={myGems}
        onAuctionCreated={handleAuctionCreated}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this auction?</p>
          {selectedAuction && (
            <div className="alert alert-warning">
              <strong>{selectedAuction.gem?.type}</strong>
              <br />
              <small>Current Bid: {formatCurrency(selectedAuction.currentBid)}</small>
            </div>
          )}
          <p className="text-muted mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Auction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AuctionsPage;