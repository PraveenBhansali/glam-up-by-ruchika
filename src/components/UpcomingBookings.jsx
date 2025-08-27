import React from 'react';
import { Calendar, Clock, Phone, Users, MapPin } from 'lucide-react';

const UpcomingBookings = ({ bookings, services }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  const getTimeUntilBooking = (date, time) => {
    const bookingDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffMs = bookingDateTime - now;
    
    if (diffMs < 0) return 'Past due';
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} away`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} away`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} away`;
    }
  };

  // Sort bookings by date/time
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Upcoming Bookings</h2>
            <p className="card-subtitle">
              {bookings.length} appointment{bookings.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>
        </div>

        <div className="card-content">
          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No Upcoming Bookings</h3>
              <p>Your schedule is clear! Create a new booking to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sortedBookings.map(booking => {
                const service = services.find(s => s.id === booking.primaryService);
                const timeUntil = getTimeUntilBooking(booking.date, booking.time);
                const isToday = new Date(booking.date).toDateString() === new Date().toDateString();
                const isTomorrow = new Date(booking.date).toDateString() === new Date(Date.now() + 86400000).toDateString();
                
                return (
                  <div key={booking.id} className="member-detail" style={{
                    borderLeft: isToday ? '4px solid #ef4444' : isTomorrow ? '4px solid #f59e0b' : '4px solid #10b981'
                  }}>
                    <div className="member-header">
                      <div>
                        <h4 className="member-title">{booking.clientName}</h4>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: isToday ? '#ef4444' : isTomorrow ? '#f59e0b' : '#10b981',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginTop: '4px'
                        }}>
                          {timeUntil}
                        </div>
                      </div>
                      <div className="status-badge status-upcoming">
                        Upcoming
                      </div>
                    </div>

                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">
                          <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Date
                        </span>
                        <span className="info-value">{formatDate(booking.date)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">
                          <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Time
                        </span>
                        <span className="info-value">{booking.time}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">
                          <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Phone
                        </span>
                        <span className="info-value">
                          <a href={`tel:${booking.clientPhone}`} style={{ color: '#ff6b9d', textDecoration: 'none' }}>
                            {booking.clientPhone}
                          </a>
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Service</span>
                        <span className="info-value">{service?.name || 'Unknown'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">
                          <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          People
                        </span>
                        <span className="info-value">{booking.estimatedPeople} estimated</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Price</span>
                        <span className="info-value" style={{ fontWeight: '700', color: '#059669' }}>
                          ₹{service?.clientPrice || 0}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div style={{ 
                        marginTop: '16px', 
                        padding: '12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: '#6b7280', 
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '4px'
                        }}>
                          Notes
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#374151', fontStyle: 'italic' }}>
                          "{booking.notes}"
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div style={{ 
                      marginTop: '16px', 
                      display: 'flex', 
                      gap: '8px',
                      paddingTop: '16px',
                      borderTop: '1px solid #e2e8f0'
                    }}>
                      <a 
                        href={`tel:${booking.clientPhone}`}
                        className="btn btn-small btn-secondary"
                        style={{ textDecoration: 'none', flex: 1 }}
                      >
                        <Phone size={16} />
                        Call
                      </a>
                      <a 
                        href={`sms:${booking.clientPhone}?body=Hi ${booking.clientName}, this is a reminder about your ${service?.name || 'makeup'} appointment on ${formatDate(booking.date)} at ${booking.time}. Looking forward to seeing you!`}
                        className="btn btn-small btn-secondary"
                        style={{ textDecoration: 'none', flex: 1 }}
                      >
                        💬 SMS
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Today's Summary */}
      {bookings.some(b => new Date(b.date).toDateString() === new Date().toDateString()) && (
        <div className="card" style={{ background: '#fef3c7', border: '2px solid #fbbf24' }}>
          <div className="card-content">
            <h3 style={{ color: '#d97706', marginBottom: '12px', fontSize: '1rem', fontWeight: '700' }}>
              📋 Today's Schedule
            </h3>
            <div style={{ color: '#92400e', fontSize: '0.875rem' }}>
              {bookings
                .filter(b => new Date(b.date).toDateString() === new Date().toDateString())
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(booking => (
                  <div key={booking.id} style={{ marginBottom: '8px' }}>
                    <strong>{booking.time}</strong> - {booking.clientName} ({getServiceName(booking.primaryService)})
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingBookings;
