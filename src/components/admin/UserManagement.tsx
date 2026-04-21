import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { Search, UserX, UserCheck } from 'lucide-react';
import { adminAPI } from '../../api/axios';
import type { AdminUser } from '../../types/admin';

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="status-pill danger">Admin</span>;
      case 'seller':
        return <span className="status-pill info">Seller</span>;
      case 'buyer':
        return <span className="status-pill verified">Buyer</span>;
      default:
        return <span className="status-pill default text-capitalize">{role}</span>;
    }
  };

  const getStatusBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="status-pill verified">
        <UserCheck size={14} className="me-1" />
        Verified
      </span>
    ) : (
      <span className="status-pill warning">
        <UserX size={14} className="me-1" />
        Unverified
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="dashboard-title animate-fade-up">
        <h4 className="fw-bold">User Management</h4>
        <p>Manage all registered users on the platform</p>
      </div>

      <Card className="content-card animate-fade-up delay-1">
        <Card.Body className="p-4">
          <div className="d-flex gap-3 mb-4">
            <InputGroup style={{ maxWidth: '400px' }}>
              <InputGroup.Text className="bg-white">
                <Search size={18} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Form.Select 
              style={{ width: 'auto' }}
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
            </Form.Select>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No users found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle surface-table">
                <thead>
                  <tr>
                    <th className="border-0 py-3">User</th>
                    <th className="border-0 py-3">Email</th>
                    <th className="border-0 py-3">Role</th>
                    <th className="border-0 py-3">Status</th>
                    <th className="border-0 py-3">Joined</th>
                    <th className="border-0 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle bg-primary bg-opacity-10 me-3 d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <span className="fw-bold text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="fw-semibold">{user.name}</div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.isVerified)}</td>
                      <td>
                        <small>{formatDate(user.createdAt)}</small>
                      </td>
                      <td className="text-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          <div className="mt-3 d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing {filteredUsers.length} of {users.length} users
            </small>
            <div className="d-flex gap-2">
              <span className="status-pill info">
                Sellers: {users.filter(u => u.role === 'seller').length}
              </span>
              <span className="status-pill verified">
                Buyers: {users.filter(u => u.role === 'buyer').length}
              </span>
              <span className="status-pill danger">
                Admins: {users.filter(u => u.role === 'admin').length}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <div className="text-center mb-4">
                <div 
                  className="rounded-circle bg-primary bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{ width: '80px', height: '80px' }}
                >
                  <span className="display-6 fw-bold text-primary">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h5 className="mb-1">{selectedUser.name}</h5>
                <p className="text-muted mb-2">{selectedUser.email}</p>
                <div className="d-flex gap-2 justify-content-center">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.isVerified)}
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <strong>User ID:</strong>
                <p className="text-muted small mb-0">{selectedUser._id}</p>
              </div>

              <div className="mb-3">
                <strong>Joined:</strong>
                <p className="text-muted mb-0">{formatDate(selectedUser.createdAt)}</p>
              </div>

              <div className="mb-3">
                <strong>Account Type:</strong>
                <p className="text-muted mb-0 text-capitalize">{selectedUser.role}</p>
              </div>

              <div className="mb-3">
                <strong>Verification Status:</strong>
                <p className="text-muted mb-0">
                  {selectedUser.isVerified ? 'Verified Account' : 'Unverified Account'}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;