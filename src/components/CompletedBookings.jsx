import React, { useState } from 'react';
import { Plus, Edit, Save, X, Trash2 } from 'lucide-react';

const CompletedBookings = ({ bookings, services, workers, onBookingUpdate }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);

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

  const openBookingDetails = (booking) => {
    setSelectedBooking({
      ...booking,
      members: booking.members || []
    });
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const addMember = () => {
    const updatedBooking = {
      ...selectedBooking,
      members: [
        ...selectedBooking.members,
        {
          name: '',
          serviceId: '',
          workerId: '',
          function: '',
          cost: 0
        }
      ]
    };
    setSelectedBooking(updatedBooking);
  };

  const removeMember = (memberIndex) => {
    const updatedBooking = {
      ...selectedBooking,
      members: selectedBooking.members.filter((_, index) => index !== memberIndex)
    };
    setSelectedBooking(updatedBooking);
  };

  const updateMember = (memberIndex, field, value) => {
    const updatedMembers = [...selectedBooking.members];
    updatedMembers[memberIndex] = {
      ...updatedMembers[memberIndex],
      [field]: value
    };

    // Auto-fill cost if service is selected
    if (field === 'serviceId' && value) {
      const service = services.find(s => s.id == value);
      if (service) {
        updatedMembers[memberIndex].cost = service.clientPrice;
      }
    }

    setSelectedBooking({
      ...selectedBooking,
      members: updatedMembers
    });
  };

  const saveBookingDetails = () => {
    // Calculate total amount
    const totalAmount = selectedBooking.members.reduce((sum, member) => {
      return sum + (parseFloat(member.cost) || 0);
    }, 0);

    const updatedBooking = {
      ...selectedBooking,
      totalAmount
    };

    onBookingUpdate(updatedBooking);
    closeModal();
    alert('Booking details saved successfully! ✅');
  };

  const renderCostBreakdown = () => {
    if (selectedBooking.members.length === 0) return null;

    const totalClientPayment = selectedBooking.members.reduce((sum, member) => {
      return sum + (parseFloat(member.cost) || 0);
    }, 0);

    const totalWorkerPayments = selectedBooking.members.reduce((sum, member) => {
      const worker = workers.find(w => w.id == member.workerId);
      return sum + (worker && !worker.isOwner ? worker.paymentRate : 0);
    }, 0);

    const netProfit = totalClientPayment - totalWorkerPayments;

    return (
      <div className="cost-breakdown">
        <h4>Cost Breakdown</h4>
        {selectedBooking.members.map((member, index) => {
          const service = services.find(s => s.id == member.serviceId);
          const worker = workers.find(w => w.id == member.workerId);
          const cost = parseFloat(member.cost) || 0;
          
          return (
            <div key={index} className="cost-item">
              <span>{member.name || `Member ${index + 1}`} - {service?.name || 'Service'}</span>
              <span>₹{cost}</span>
            </div>
          );
        })}
        
        <div className="cost-item" style={{ borderTop: '1px solid #dcfce7', paddingTop: '8px', marginTop: '8px' }}>
          <span>Total Client Payment</span>
          <span>₹{totalClientPayment}</span>
        </div>
        
        <div className="cost-item">
          <span>Total Worker Payments</span>
          <span>₹{totalWorkerPayments}</span>
        </div>
        
        <div className="cost-item cost-total">
          <span>Your Net Profit</span>
          <span>₹{netProfit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Completed Bookings</h2>
            <p className="card-subtitle">
              {bookings.length} completed appointment{bookings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="card-content">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✅</div>
              <h3>No Completed Bookings</h3>
              <p>Completed bookings will appear here automatically after their scheduled time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map(booking => {
                const service = services.find(s => s.id === booking.primaryService);
                const hasDetails = booking.members && booking.members.length > 0;
                
                return (
                  <div key={booking.id} className="member-detail">
                    <div className="member-header">
                      <div>
                        <h4 className="member-title">{booking.clientName}</h4>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>
                          {formatDate(booking.date)} at {booking.time}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="status-badge status-completed">
                          Completed
                        </div>
                        <button
                          onClick={() => openBookingDetails(booking)}
                          className="btn btn-small btn-secondary"
                        >
                          <Edit size={16} />
                          {hasDetails ? 'Edit Details' : 'Add Details'}
                        </button>
                      </div>
                    </div>

                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Service</span>
                        <span className="info-value">{service?.name || 'Unknown'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Phone</span>
                        <span className="info-value">{booking.clientPhone}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">People Served</span>
                        <span className="info-value">
                          {hasDetails ? `${booking.members.length} actual` : `${booking.estimatedPeople} estimated`}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Total Amount</span>
                        <span className="info-value" style={{ fontWeight: '700', color: '#059669' }}>
                          {booking.totalAmount > 0 ? `₹${booking.totalAmount.toLocaleString()}` : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontStyle: 'italic'
                      }}>
                        "{booking.notes}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedBooking.clientName} - Service Details</h2>
              <button onClick={closeModal} className="modal-close">&times;</button>
            </div>
            
            <div className="modal-content">
              <div style={{ marginBottom: '24px' }}>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Date & Time</span>
                    <span className="info-value">{formatDate(selectedBooking.date)} at {selectedBooking.time}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{selectedBooking.clientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Members Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '16px', color: '#374151' }}>Service Details by Member</h4>
                
                {selectedBooking.members.map((member, index) => (
                  <div key={index} className="member-detail" style={{ marginBottom: '16px' }}>
                    <div className="member-header">
                      <h5 className="member-title">Member {index + 1}</h5>
                      <button
                        onClick={() => removeMember(index)}
                        className="btn btn-small btn-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          value={member.name || ''}
                          onChange={(e) => updateMember(index, 'name', e.target.value)}
                          className="form-input"
                          placeholder="Enter member's name"
                        />
                      </div>

                      <div className="info-grid">
                        <div className="form-group">
                          <label className="form-label">Service</label>
                          <select
                            value={member.serviceId || ''}
                            onChange={(e) => updateMember(index, 'serviceId', e.target.value)}
                            className="form-select"
                          >
                            <option value="">Select Service</option>
                            {services.map(service => (
                              <option key={service.id} value={service.id}>
                                {service.name} - ₹{service.clientPrice}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Performed By</label>
                          <select
                            value={member.workerId || ''}
                            onChange={(e) => updateMember(index, 'workerId', e.target.value)}
                            className="form-select"
                          >
                            <option value="">Select Worker</option>
                            {workers.map(worker => (
                              <option key={worker.id} value={worker.id}>
                                {worker.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="info-grid">
                        <div className="form-group">
                          <label className="form-label">Function/Event</label>
                          <input
                            type="text"
                            value={member.function || ''}
                            onChange={(e) => updateMember(index, 'function', e.target.value)}
                            className="form-input"
                            placeholder="e.g., Wedding, Party, Engagement"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Cost (₹)</label>
                          <input
                            type="number"
                            value={member.cost || ''}
                            onChange={(e) => updateMember(index, 'cost', e.target.value)}
                            className="form-input"
                            min="0"
                            step="50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={addMember} className="add-member-btn">
                  <Plus size={20} />
                </button>
              </div>

              {/* Cost Breakdown */}
              {renderCostBreakdown()}

              {/* Save Button */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button onClick={saveBookingDetails} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={20} />
                  Save Details
                </button>
                <button onClick={closeModal} className="btn btn-secondary">
                  <X size={20} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedBookings;
