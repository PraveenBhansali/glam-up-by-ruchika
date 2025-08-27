import React, { useState } from 'react';
import { Plus, User, Phone, Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { createBooking } from '../services/bookingService';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Find the selected service
      const selectedService = services.find(s => s.id === parseInt(formData.primaryService));
      
      const bookingData = {
        name: formData.clientName,
        email: '', // We can add email field later if needed
        phone: formData.clientPhone,
        service: selectedService ? selectedService.name : '',
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        estimated_people: parseInt(formData.estimatedPeople),
        service_price: selectedService ? selectedService.clientPrice : 0,
        status: 'upcoming'
      };

      const result = await createBooking(bookingData);
      
      if (result.success) {
        // Create booking object for local state (backward compatibility)
        const booking = {
          id: result.data.id,
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          date: formData.date,
          time: formData.time,
          primaryService: parseInt(formData.primaryService),
          estimatedPeople: parseInt(formData.estimatedPeople),
          notes: formData.notes,
          status: 'upcoming',
          createdAt: result.data.created_at,
          members: [],
          totalAmount: selectedService ? selectedService.clientPrice : 0
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
        alert('Booking created successfully! 🎉✨ Your data is now saved online!');
      } else {
        alert('Error creating booking: ' + result.error + '\n\nFalling back to local storage...');
        
        // Fallback to local storage if Supabase fails
        const booking = {
          id: Date.now(),
          clientName: formData.clientName,
          clientPhone: formData.clientPhone,
          date: formData.date,
          time: formData.time,
          primaryService: parseInt(formData.primaryService),
          estimatedPeople: parseInt(formData.estimatedPeople),
          notes: formData.notes,
          status: 'upcoming',
          createdAt: new Date().toISOString(),
          members: [],
          totalAmount: selectedService ? selectedService.clientPrice : 0
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
        
        alert('Booking saved locally! 📱');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
