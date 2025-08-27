import React, { useState } from 'react';
import { Plus, Edit2, Trash2, DollarSign, Save, X } from 'lucide-react';

const ServicesManager = ({ services, onServicesUpdate }) => {
  const [newService, setNewService] = useState({
    name: '',
    clientPrice: '',
    description: ''
  });
  const [editingService, setEditingService] = useState(null);

  const handleAddService = (e) => {
    e.preventDefault();
    
    if (!newService.name.trim() || !newService.clientPrice) {
      alert('Please enter both service name and price');
      return;
    }

    const service = {
      id: Date.now(),
      name: newService.name.trim(),
      clientPrice: parseFloat(newService.clientPrice),
      description: newService.description.trim()
    };

    onServicesUpdate([...services, service]);
    setNewService({ name: '', clientPrice: '', description: '' });
    alert('Service added successfully! 🎉');
  };

  const handleEditService = (service) => {
    setEditingService({
      ...service,
      clientPrice: service.clientPrice.toString()
    });
  };

  const handleSaveEdit = () => {
    if (!editingService.name.trim() || !editingService.clientPrice) {
      alert('Please enter both service name and price');
      return;
    }

    const updatedServices = services.map(service =>
      service.id === editingService.id
        ? {
            ...editingService,
            name: editingService.name.trim(),
            clientPrice: parseFloat(editingService.clientPrice),
            description: editingService.description.trim()
          }
        : service
    );

    onServicesUpdate(updatedServices);
    setEditingService(null);
    alert('Service updated successfully! ✅');
  };

  const handleDeleteService = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    
    if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
      onServicesUpdate(services.filter(s => s.id !== serviceId));
      alert('Service deleted successfully');
    }
  };

  const handleChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    
    if (isEditing) {
      setEditingService(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewService(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="form-container">
      {/* Add New Service */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Add New Service</h2>
            <p className="card-subtitle">Create a new service offering</p>
          </div>
        </div>

        <form onSubmit={handleAddService} className="card-content">
          <div className="form-group">
            <label className="form-label">Service Name</label>
            <input
              type="text"
              name="name"
              value={newService.name}
              onChange={(e) => handleChange(e, false)}
              className="form-input"
              placeholder="e.g., HD Makeup, Bridal Package"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <DollarSign size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Client Price (₹)
            </label>
            <input
              type="number"
              name="clientPrice"
              value={newService.clientPrice}
              onChange={(e) => handleChange(e, false)}
              className="form-input"
              placeholder="e.g., 2500"
              min="0"
              step="50"
              required
            />
            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
              This is the amount you charge clients for this service
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              name="description"
              value={newService.description}
              onChange={(e) => handleChange(e, false)}
              className="form-textarea"
              placeholder="Brief description of what's included in this service..."
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <Plus size={20} />
            Add Service
          </button>
        </form>
      </div>

      {/* Services List */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Your Services</h2>
            <p className="card-subtitle">{services.length} service{services.length !== 1 ? 's' : ''} available</p>
          </div>
        </div>

        <div className="card-content">
          {services.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💄</div>
              <h3>No Services Added</h3>
              <p>Add your first service to get started with bookings</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {services.map(service => (
                <div key={service.id} className="member-detail">
                  {editingService && editingService.id === service.id ? (
                    // Edit Mode
                    <div>
                      <div className="member-header">
                        <h4 className="member-title">Edit Service</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={handleSaveEdit}
                            className="btn btn-small btn-success"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingService(null)}
                            className="btn btn-small btn-secondary"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Service Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editingService.name}
                            onChange={(e) => handleChange(e, true)}
                            className="form-input"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Client Price (₹)</label>
                          <input
                            type="number"
                            name="clientPrice"
                            value={editingService.clientPrice}
                            onChange={(e) => handleChange(e, true)}
                            className="form-input"
                            min="0"
                            step="50"
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Description</label>
                          <textarea
                            name="description"
                            value={editingService.description}
                            onChange={(e) => handleChange(e, true)}
                            className="form-textarea"
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="member-header">
                        <div>
                          <h4 className="member-title">{service.name}</h4>
                          <div style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: '700', 
                            color: '#059669',
                            marginTop: '4px'
                          }}>
                            ₹{service.clientPrice.toLocaleString()}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditService(service)}
                            className="btn btn-small btn-secondary"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="btn btn-small btn-danger"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {service.description && (
                        <div style={{ 
                          marginTop: '12px',
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          fontStyle: 'italic',
                          lineHeight: '1.5'
                        }}>
                          {service.description}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing Strategy Info */}
      <div className="card" style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
        <div className="card-content">
          <h3 style={{ color: '#166534', marginBottom: '12px', fontSize: '1rem', fontWeight: '700' }}>
            💡 Pricing Strategy Tips
          </h3>
          <div style={{ color: '#15803d', fontSize: '0.875rem', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Research Market Rates:</strong> Check what other makeup artists in your area charge
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Factor in Costs:</strong> Include travel time, products used, and worker payments
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Premium Services:</strong> Charge more for HD makeup, bridal packages, or special events
            </p>
            <p>
              <strong>Package Deals:</strong> Offer discounts for multiple services or group bookings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesManager;
