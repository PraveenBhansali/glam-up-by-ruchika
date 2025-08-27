import React, { useState, useMemo } from 'react';
import { Calendar, DollarSign, Users, Filter, TrendingUp, Eye } from 'lucide-react';
import { format } from 'date-fns';

const BookingHistory = ({ bookings, services, workers }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const totalBookings = bookings.length;
    const completedCount = completedBookings.length;
    const upcomingCount = bookings.filter(b => b.status === 'upcoming').length;
    
    // Calculate worker payments
    const totalWorkerPayments = completedBookings.reduce((sum, booking) => {
      return sum + booking.members.reduce((memberSum, member) => {
        const worker = workers.find(w => w.id == member.workerId);
        return memberSum + (worker && !worker.isOwner ? worker.paymentRate : 0);
      }, 0);
    }, 0);

    const netProfit = totalRevenue - totalWorkerPayments;

    return {
      totalBookings,
      completedCount,
      upcomingCount,
      totalRevenue,
      totalWorkerPayments,
      netProfit,
      averageBookingValue: completedCount > 0 ? totalRevenue / completedCount : 0
    };
  }, [bookings, workers]);

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`);
        case 'date-asc':
          return new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`);
        case 'amount-desc':
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case 'amount-asc':
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        case 'name-asc':
          return a.clientName.localeCompare(b.clientName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookings, filterStatus, sortBy]);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const getWorkerName = (workerId) => {
    const worker = workers.find(w => w.id == workerId);
    return worker ? worker.name : 'Unknown Worker';
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="form-container">
      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>{stats.totalBookings}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Bookings</div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💰</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#059669' }}>₹{stats.totalRevenue.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0369a1' }}>₹{stats.netProfit.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Profit</div>
        </div>

        <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#7c3aed' }}>₹{Math.round(stats.averageBookingValue).toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Booking</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Booking History</h2>
            <p className="card-subtitle">Complete record of all your bookings</p>
          </div>
        </div>

        <div className="card-content">
          <div className="info-grid">
            <div className="form-group">
              <label className="form-label">
                <Filter size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <TrendingUp size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
                <option value="name-asc">Client Name A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="card">
        <div className="card-content">
          {filteredAndSortedBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No Bookings Found</h3>
              <p>No bookings match your current filters</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredAndSortedBookings.map(booking => {
                const service = services.find(s => s.id === booking.primaryService);
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
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status}
                        </span>
                        <button
                          onClick={() => openBookingDetails(booking)}
                          className="btn btn-small btn-secondary"
                        >
                          <Eye size={16} />
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
                        <span className="info-label">People</span>
                        <span className="info-value">{booking.estimatedPeople} estimated</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Total Amount</span>
                        <span className="info-value" style={{ fontWeight: '700', color: '#059669' }}>
                          {booking.totalAmount > 0 ? `₹${booking.totalAmount.toLocaleString()}` : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div style={{ marginTop: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.875rem', fontStyle: 'italic' }}>
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

      {/* Detailed View Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedBooking.clientName} - Details</h2>
              <button onClick={closeModal} className="modal-close">&times;</button>
            </div>
            
            <div className="modal-content">
              <div className="info-grid" style={{ marginBottom: '24px' }}>
                <div className="info-item">
                  <span className="info-label">Date & Time</span>
                  <span className="info-value">{formatDate(selectedBooking.date)} at {selectedBooking.time}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{selectedBooking.clientPhone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Primary Service</span>
                  <span className="info-value">{getServiceName(selectedBooking.primaryService)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span className={`status-badge status-${selectedBooking.status}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                  <h4 style={{ marginBottom: '8px', color: '#374151' }}>Notes</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>"{selectedBooking.notes}"</p>
                </div>
              )}

              {selectedBooking.members && selectedBooking.members.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '16px', color: '#374151' }}>Service Details</h4>
                  {selectedBooking.members.map((member, index) => (
                    <div key={index} className="member-detail" style={{ marginBottom: '16px' }}>
                      <h5 style={{ marginBottom: '12px', color: '#1f2937' }}>
                        {member.name || `Member ${index + 1}`}
                      </h5>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Service</span>
                          <span className="info-value">{getServiceName(member.serviceId)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Performed By</span>
                          <span className="info-value">{getWorkerName(member.workerId)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Function</span>
                          <span className="info-value">{member.function || 'Not specified'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Cost</span>
                          <span className="info-value" style={{ fontWeight: '700', color: '#059669' }}>
                            ₹{member.cost || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="cost-breakdown">
                    <h4>Financial Summary</h4>
                    <div className="cost-item">
                      <span>Total Client Payment</span>
                      <span>₹{selectedBooking.totalAmount || 0}</span>
                    </div>
                    <div className="cost-item">
                      <span>Worker Payments</span>
                      <span>₹{selectedBooking.members.reduce((sum, member) => {
                        const worker = workers.find(w => w.id == member.workerId);
                        return sum + (worker && !worker.isOwner ? worker.paymentRate : 0);
                      }, 0)}</span>
                    </div>
                    <div className="cost-item cost-total">
                      <span>Your Profit</span>
                      <span>₹{(selectedBooking.totalAmount || 0) - selectedBooking.members.reduce((sum, member) => {
                        const worker = workers.find(w => w.id == member.workerId);
                        return sum + (worker && !worker.isOwner ? worker.paymentRate : 0);
                      }, 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
