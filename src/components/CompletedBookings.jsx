import React, { useState } from 'react';
import { Edit, Save, X, Trash2, Star } from 'lucide-react';
import { getBookingDetails, updateBookingDetails, deleteBookingDetails } from '../services/bookingDetailsService';
import { useToast } from '../contexts/ToastContext';

const CompletedBookings = ({ bookings, services, workers, onBookingUpdate }) => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const loadBookingDetails = async (bookingId) => {
    setIsLoading(true);
    try {
      const result = await getBookingDetails(bookingId);
      if (result.success && result.data) {
        setBookingDetails(result.data);
      } else {
        // Initialize empty details if none exist
        setBookingDetails({
          payment_status: 'pending',
          payment_amount: 0,
          payment_method: '',
          payment_notes: '',
          actual_people: null,
          completion_notes: '',
          client_feedback: '',
          client_rating: null,
          photos_uploaded: false
        });
      }
    } catch (err) {
      error('Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const openBookingDetails = async (booking) => {
    setSelectedBooking(booking);
    await loadBookingDetails(booking.id);
    setIsEditing(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setBookingDetails({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!selectedBooking) return;
    
    setIsLoading(true);
    try {
      const result = await updateBookingDetails(selectedBooking.id, bookingDetails);
      if (result.success) {
        success('Booking details saved successfully!');
        setIsEditing(false);
      } else {
        error('Failed to save booking details: ' + result.error);
      }
    } catch (err) {
      error('Failed to save booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                📋 Booking Details - {selectedBooking.clientName}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="btn btn-small btn-success"
                    disabled={isLoading}
                  >
                    <Save size={16} />
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="btn btn-small btn-secondary"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Booking Info */}
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: '600' }}>📅 Booking Information</h4>
              <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#6b7280' }}>
                📞 {selectedBooking.clientPhone} • 💄 {getServiceName(selectedBooking.primaryService)}
              </p>
              <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#6b7280' }}>
                📅 {formatDate(selectedBooking.date)} • ⏰ {selectedBooking.time} • 👥 {selectedBooking.estimatedPeople} people
              </p>
              <p style={{ margin: '4px 0', fontSize: '0.875rem', color: '#6b7280' }}>
                💰 Service Price: ₹{selectedBooking.totalAmount?.toLocaleString() || 0}
              </p>
            </div>

            {/* Payment Information */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600' }}>💰 Payment Information</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Payment Status</label>
                  <select
                    value={bookingDetails.payment_status || 'pending'}
                    onChange={(e) => handleInputChange('payment_status', e.target.value)}
                    className="form-input"
                    disabled={!isEditing}
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
                    onChange={(e) => handleInputChange('payment_amount', parseInt(e.target.value) || 0)}
                    className="form-input"
                    placeholder="0"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <input
                  type="text"
                  value={bookingDetails.payment_method || ''}
                  onChange={(e) => handleInputChange('payment_method', e.target.value)}
                  className="form-input"
                  placeholder="Cash, UPI, Bank Transfer, etc."
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Service Details */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600' }}>💄 Service Details</h4>
              
              <div className="form-group">
                <label className="form-label">Actual People Served</label>
                <input
                  type="number"
                  value={bookingDetails.actual_people || ''}
                  onChange={(e) => handleInputChange('actual_people', parseInt(e.target.value) || null)}
                  className="form-input"
                  placeholder="Number of people"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Client Feedback */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600' }}>⭐ Client Feedback</h4>
              
              <div className="form-group">
                <label className="form-label">Client Rating</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => isEditing && handleInputChange('client_rating', i + 1)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: isEditing ? 'pointer' : 'default',
                        padding: '4px'
                      }}
                      disabled={!isEditing}
                    >
                      <Star
                        size={20}
                        fill={i < (bookingDetails.client_rating || 0) ? '#fbbf24' : 'none'}
                        color={i < (bookingDetails.client_rating || 0) ? '#fbbf24' : '#d1d5db'}
                      />
                    </button>
                  ))}
                  <span style={{ marginLeft: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                    {bookingDetails.client_rating ? `${bookingDetails.client_rating}/5` : 'No rating'}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Client Feedback</label>
                <textarea
                  value={bookingDetails.client_feedback || ''}
                  onChange={(e) => handleInputChange('client_feedback', e.target.value)}
                  className="form-textarea"
                  placeholder="What did the client say about the service?"
                  rows="3"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Completion Notes */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600' }}>📝 Completion Notes</h4>
              
              <div className="form-group">
                <label className="form-label">Internal Notes</label>
                <textarea
                  value={bookingDetails.completion_notes || ''}
                  onChange={(e) => handleInputChange('completion_notes', e.target.value)}
                  className="form-textarea"
                  placeholder="Internal notes about this booking completion..."
                  rows="4"
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Photos */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600' }}>📸 Photos</h4>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={bookingDetails.photos_uploaded || false}
                    onChange={(e) => handleInputChange('photos_uploaded', e.target.checked)}
                    disabled={!isEditing}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Photos uploaded</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedBookings;
