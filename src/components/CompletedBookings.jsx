import React, { useState } from 'react';
import { Edit, Save, X, Trash2, Star, Plus, User, DollarSign } from 'lucide-react';
import { getBookingDetails, updateBookingDetails } from '../services/bookingDetailsService';
import { getBookingMembers, createBookingMember, updateBookingMember, deleteBookingMember } from '../services/bookingMembersService';
import { useToast } from '../contexts/ToastContext';

const CompletedBookings = ({ bookings, services, workers, onBookingUpdate }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});
  const [bookingMembers, setBookingMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('members'); // 'members' or 'payment'
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    member_name: '',
    member_relation: '',
    service_provided: '',
    worker_assigned: '',
    occasion: '',
    service_price: 0
  });
  const { success, error } = useToast();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const loadBookingData = async (bookingId) => {
    setIsLoading(true);
    try {
      // Load payment details
      const detailsResult = await getBookingDetails(bookingId);
      if (detailsResult.success && detailsResult.data) {
        setBookingDetails(detailsResult.data);
      } else {
        setBookingDetails({
          payment_status: 'pending',
          payment_amount: 0,
          payment_method: '',
          payment_notes: ''
        });
      }

      // Load member details
      const membersResult = await getBookingMembers(bookingId);
      if (membersResult.success) {
        setBookingMembers(membersResult.data || []);
      } else {
        setBookingMembers([]);
      }
    } catch (err) {
      error('Failed to load booking data');
    } finally {
      setIsLoading(false);
    }
  };

  const openBookingDetails = async (booking) => {
    setSelectedBooking(booking);
    await loadBookingData(booking.id);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setBookingDetails({});
    setBookingMembers([]);
    setEditingMember(null);
    setNewMember({
      member_name: '',
      member_relation: '',
      service_provided: '',
      worker_assigned: '',
      occasion: '',
      service_price: 0
    });
  };

  const handleSavePayment = async () => {
    if (!selectedBooking) return;
    
    setIsLoading(true);
    try {
      const result = await updateBookingDetails(selectedBooking.id, bookingDetails);
      if (result.success) {
        success('Payment details saved successfully!');
      } else {
        error('Failed to save payment details: ' + result.error);
      }
    } catch (err) {
      error('Failed to save payment details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedBooking || !newMember.member_name || !newMember.service_provided) {
      error('Please fill in member name and service provided');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createBookingMember(selectedBooking.id, newMember);
      if (result.success) {
        setBookingMembers([...bookingMembers, result.data]);
        setNewMember({
          member_name: '',
          member_relation: '',
          service_provided: '',
          worker_assigned: '',
          occasion: '',
          service_price: 0
        });
        success('Member added successfully!');
      } else {
        error('Failed to add member: ' + result.error);
      }
    } catch (err) {
      error('Failed to add member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMember = (member) => {
    setEditingMember({ ...member });
  };

  const handleSaveMember = async () => {
    if (!editingMember) return;

    setIsLoading(true);
    try {
      const result = await updateBookingMember(editingMember.id, editingMember);
      if (result.success) {
        setBookingMembers(bookingMembers.map(m => 
          m.id === editingMember.id ? result.data : m
        ));
        setEditingMember(null);
        success('Member updated successfully!');
      } else {
        error('Failed to update member: ' + result.error);
      }
    } catch (err) {
      error('Failed to update member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    setIsLoading(true);
    try {
      const result = await deleteBookingMember(memberId);
      if (result.success) {
        setBookingMembers(bookingMembers.filter(m => m.id !== memberId));
        success('Member deleted successfully!');
      } else {
        error('Failed to delete member: ' + result.error);
      }
    } catch (err) {
      error('Failed to delete member');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalRevenue = () => {
    return bookingMembers.reduce((sum, member) => sum + (member.service_price || 0), 0);
  };

  if (bookings.length === 0) {
    return (
      <div className="form-container">
        <div className="empty-state">
          <div className="empty-state-icon">✅</div>
          <h3>No Completed Bookings</h3>
          <p>Completed bookings will appear here once services are finished</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">✅ Completed Bookings</h2>
            <p className="card-subtitle">{bookings.length} completed booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="card-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map(booking => (
              <div key={booking.id} className="member-detail">
                <div className="member-header">
                  <div>
                    <h4 className="member-title">👤 {booking.clientName}</h4>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                      📞 {booking.clientPhone} • 💄 {getServiceName(booking.primaryService)}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>
                      📅 {formatDate(booking.date)} • ⏰ {booking.time} • 💰 ₹{booking.totalAmount?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openBookingDetails(booking)}
                      className="btn btn-small btn-primary"
                      disabled={isLoading}
                    >
                      <Edit size={16} />
                      {isLoading ? 'Loading...' : 'Manage Details'}
                    </button>
                  </div>
                </div>
                
                {booking.notes && (
                  <div style={{ 
                    marginTop: '12px',
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    fontStyle: 'italic'
                  }}>
                    📝 {booking.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                📋 {selectedBooking.clientName} - {formatDate(selectedBooking.date)}
              </h3>
              <button onClick={closeModal} className="btn btn-small btn-secondary">
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setActiveTab('members')}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  background: activeTab === 'members' ? '#3b82f6' : 'transparent',
                  color: activeTab === 'members' ? 'white' : '#6b7280',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Member Details
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                style={{
                  padding: '12px 16px',
                  border: 'none',
                  background: activeTab === 'payment' ? '#3b82f6' : 'transparent',
                  color: activeTab === 'payment' ? 'white' : '#6b7280',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                <DollarSign size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Payment Details
              </button>
            </div>

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                {/* Add New Member */}
                <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600' }}>➕ Add New Member</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Member Name *</label>
                      <input
                        type="text"
                        value={newMember.member_name}
                        onChange={(e) => setNewMember({...newMember, member_name: e.target.value})}
                        className="form-input"
                        placeholder="Full name"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Relation</label>
                      <input
                        type="text"
                        value={newMember.member_relation}
                        onChange={(e) => setNewMember({...newMember, member_relation: e.target.value})}
                        className="form-input"
                        placeholder="Bride, Sister, Mother, Friend..."
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Service Provided *</label>
                      <select
                        value={newMember.service_provided}
                        onChange={(e) => setNewMember({...newMember, service_provided: e.target.value})}
                        className="form-input"
                        disabled={isLoading}
                      >
                        <option value="">Select service</option>
                        {services.map(service => (
                          <option key={service.id} value={service.name}>{service.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Worker Assigned</label>
                      <select
                        value={newMember.worker_assigned}
                        onChange={(e) => setNewMember({...newMember, worker_assigned: e.target.value})}
                        className="form-input"
                        disabled={isLoading}
                      >
                        <option value="">Select worker</option>
                        {workers.map(worker => (
                          <option key={worker.id} value={worker.name}>{worker.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Occasion</label>
                      <input
                        type="text"
                        value={newMember.occasion}
                        onChange={(e) => setNewMember({...newMember, occasion: e.target.value})}
                        className="form-input"
                        placeholder="Wedding, Engagement, Party..."
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Service Price (₹)</label>
                      <input
                        type="number"
                        value={newMember.service_price}
                        onChange={(e) => setNewMember({...newMember, service_price: parseInt(e.target.value) || 0})}
                        className="form-input"
                        placeholder="0"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddMember}
                    className="btn btn-primary"
                    disabled={isLoading || !newMember.member_name || !newMember.service_provided}
                  >
                    <Plus size={16} />
                    {isLoading ? 'Adding...' : 'Add Member'}
                  </button>
                </div>

                {/* Members List */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                      👥 Members ({bookingMembers.length})
                    </h4>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Total Revenue: ₹{getTotalRevenue().toLocaleString()}
                    </div>
                  </div>

                  {bookingMembers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                      No members added yet. Add the first member above.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {bookingMembers.map(member => (
                        <div key={member.id} className="member-detail">
                          {editingMember && editingMember.id === member.id ? (
                            // Edit Mode
                            <div style={{ padding: '16px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className="form-group">
                                  <label className="form-label">Member Name</label>
                                  <input
                                    type="text"
                                    value={editingMember.member_name}
                                    onChange={(e) => setEditingMember({...editingMember, member_name: e.target.value})}
                                    className="form-input"
                                    disabled={isLoading}
                                  />
                                </div>
                                
                                <div className="form-group">
                                  <label className="form-label">Relation</label>
                                  <input
                                    type="text"
                                    value={editingMember.member_relation}
                                    onChange={(e) => setEditingMember({...editingMember, member_relation: e.target.value})}
                                    className="form-input"
                                    disabled={isLoading}
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className="form-group">
                                  <label className="form-label">Service Provided</label>
                                  <select
                                    value={editingMember.service_provided}
                                    onChange={(e) => setEditingMember({...editingMember, service_provided: e.target.value})}
                                    className="form-input"
                                    disabled={isLoading}
                                  >
                                    <option value="">Select service</option>
                                    {services.map(service => (
                                      <option key={service.id} value={service.name}>{service.name}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div className="form-group">
                                  <label className="form-label">Worker Assigned</label>
                                  <select
                                    value={editingMember.worker_assigned}
                                    onChange={(e) => setEditingMember({...editingMember, worker_assigned: e.target.value})}
                                    className="form-input"
                                    disabled={isLoading}
                                  >
                                    <option value="">Select worker</option>
                                    {workers.map(worker => (
                                      <option key={worker.id} value={worker.name}>{worker.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className="form-group">
                                  <label className="form-label">Occasion</label>
                                  <input
                                    type="text"
                                    value={editingMember.occasion}
                                    onChange={(e) => setEditingMember({...editingMember, occasion: e.target.value})}
                                    className="form-input"
                                    disabled={isLoading}
                                  />
                                </div>
                                
                                <div className="form-group">
                                  <label className="form-label">Service Price (₹)</label>
                                  <input
                                    type="number"
                                    value={editingMember.service_price}
                                    onChange={(e) => setEditingMember({...editingMember, service_price: parseInt(e.target.value) || 0})}
                                    className="form-input"
                                    disabled={isLoading}
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={handleSaveMember}
                                  className="btn btn-small btn-success"
                                  disabled={isLoading}
                                >
                                  <Save size={16} />
                                  {isLoading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  onClick={() => setEditingMember(null)}
                                  className="btn btn-small btn-secondary"
                                  disabled={isLoading}
                                >
                                  <X size={16} />
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            // View Mode
                            <div className="member-header">
                              <div>
                                <h5 className="member-title">
                                  👤 {member.member_name}
                                  {member.member_relation && <span style={{ color: '#6b7280', fontWeight: 'normal' }}> ({member.member_relation})</span>}
                                </h5>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                                  💄 {member.service_provided}
                                  {member.worker_assigned && <span> • 👨‍💼 {member.worker_assigned}</span>}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>
                                  {member.occasion && <span>🎉 {member.occasion} • </span>}
                                  💰 ₹{member.service_price?.toLocaleString() || 0}
                                </div>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleEditMember(member)}
                                  className="btn btn-small btn-secondary"
                                  disabled={isLoading}
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="btn btn-small btn-danger"
                                  disabled={isLoading}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600' }}>💰 Payment Information</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Payment Status</label>
                    <select
                      value={bookingDetails.payment_status || 'pending'}
                      onChange={(e) => setBookingDetails({...bookingDetails, payment_status: e.target.value})}
                      className="form-input"
                      disabled={isLoading}
                    >
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Amount Received (₹)</label>
                    <input
                      type="number"
                      value={bookingDetails.payment_amount || ''}
                      onChange={(e) => setBookingDetails({...bookingDetails, payment_amount: parseInt(e.target.value) || 0})}
                      className="form-input"
                      placeholder="0"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Payment Method</label>
                  <input
                    type="text"
                    value={bookingDetails.payment_method || ''}
                    onChange={(e) => setBookingDetails({...bookingDetails, payment_method: e.target.value})}
                    className="form-input"
                    placeholder="Cash, UPI, Bank Transfer, etc."
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Payment Notes</label>
                  <textarea
                    value={bookingDetails.payment_notes || ''}
                    onChange={(e) => setBookingDetails({...bookingDetails, payment_notes: e.target.value})}
                    className="form-textarea"
                    placeholder="Additional payment notes..."
                    rows="3"
                    disabled={isLoading}
                  />
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '16px' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '0.875rem', fontWeight: '600' }}>💰 Revenue Summary</h5>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    <div>Total from Members: ₹{getTotalRevenue().toLocaleString()}</div>
                    <div>Amount Received: ₹{(bookingDetails.payment_amount || 0).toLocaleString()}</div>
                    <div style={{ fontWeight: '600', color: getTotalRevenue() - (bookingDetails.payment_amount || 0) > 0 ? '#ef4444' : '#10b981' }}>
                      Balance: ₹{(getTotalRevenue() - (bookingDetails.payment_amount || 0)).toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSavePayment}
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  <Save size={16} />
                  {isLoading ? 'Saving...' : 'Save Payment Details'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedBookings;
