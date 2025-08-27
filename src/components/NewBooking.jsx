import React, { useState } from 'react';
import { Plus, User, Phone, Calendar, Clock, DollarSign, Users } from 'lucide-react';

const NewBooking = ({ services, onBookingCreate }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    date: '',
    time: '',
    primaryService: '',
    estimatedPeople: 1,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const booking = {
      id: Date.now(),
      ...formData,
      primaryService: parseInt(formData.primaryService),
      estimatedPeople: parseInt(formData.estimatedPeople),
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      members: [],
      totalAmount: 0
    };
    
    onBookingCreate(booking);
    
    // Reset form
    setFormData({
      clientName: '',
      clientPhone: '',
      date: '',
      time: '',
      primaryService: '',
      estimatedPeople: 1,
      notes: ''
    });
    
    // Show success message
    alert('Booking created successfully! 🎉✨');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">✨ Create New Booking</h2>
            <p className="card-subtitle">Add a beautiful new client appointment 💄</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-content">
          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Client Name 👸
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your beautiful client's name ✨"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Phone size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Phone Number 📱 (Optional)
            </label>
            <input
              type="tel"
              name="clientPhone"
              value={formData.clientPhone}
              onChange={handleChange}
              className="form-input"
              placeholder="+91 98765 43210"
            />
            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
              💡 Add phone number for easy calling and SMS reminders
            </small>
          </div>

          <div className="info-grid">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Date 📅
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={16} style={{ display: 'inline', marginRight: '8px' }} />
                Time ⏰
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <DollarSign size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Primary Service 💅
            </label>
            <select
              name="primaryService"
              value={formData.primaryService}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Choose your magic service ✨</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} - ₹{service.clientPrice} 💖
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Users size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Estimated People 👥
            </label>
            <input
              type="number"
              name="estimatedPeople"
              value={formData.estimatedPeople}
              onChange={handleChange}
              className="form-input"
              min="1"
              max="20"
              required
            />
            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
              💡 How many gorgeous people will you be beautifying?
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Notes 📝 (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Any special requirements, location details, or magical requests... ✨"
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <Plus size={20} />
            Create Magical Booking ✨
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewBooking;
