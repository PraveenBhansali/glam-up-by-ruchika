import React, { useState } from 'react';
import { Plus, Edit2, Trash2, User, DollarSign, Save, X } from 'lucide-react';
import { createWorker, updateWorker, deleteWorker } from '../services/workersService';

const WorkersManager = ({ workers, onWorkersUpdate }) => {
  const [newWorker, setNewWorker] = useState({
    name: '',
    role: '',
    paymentRate: ''
  });
  const [editingWorker, setEditingWorker] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddWorker = async (e) => {
    e.preventDefault();
    
    if (!newWorker.name.trim() || !newWorker.role.trim() || !newWorker.paymentRate) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const workerData = {
        name: newWorker.name.trim(),
        role: newWorker.role.trim(),
        paymentRate: parseFloat(newWorker.paymentRate),
        isOwner: false
      };

      const result = await createWorker(workerData);
      
      if (result.success) {
        // Add to local state
        const newWorkerFormatted = {
          id: result.data.id,
          name: result.data.name,
          role: result.data.role,
          paymentRate: result.data.payment_rate,
          isOwner: result.data.is_owner
        };
        
        onWorkersUpdate([...workers, newWorkerFormatted]);
        setNewWorker({ name: '', role: '', paymentRate: '' });
        alert('Worker added successfully! 👥 Saved to cloud database!');
      } else {
        alert('Error adding worker: ' + result.error + '\n\nFalling back to local storage...');
        
        // Fallback to local storage
        const worker = {
          id: Date.now(),
          name: newWorker.name.trim(),
          role: newWorker.role.trim(),
          paymentRate: parseFloat(newWorker.paymentRate),
          isOwner: false
        };

        onWorkersUpdate([...workers, worker]);
        setNewWorker({ name: '', role: '', paymentRate: '' });
        alert('Worker added locally! 📱');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditWorker = (worker) => {
    setEditingWorker({
      ...worker,
      paymentRate: worker.paymentRate.toString()
    });
  };

  const handleSaveEdit = async () => {
    if (!editingWorker.name.trim() || !editingWorker.role.trim() || !editingWorker.paymentRate) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const workerData = {
        name: editingWorker.name.trim(),
        role: editingWorker.role.trim(),
        paymentRate: parseFloat(editingWorker.paymentRate),
        isOwner: editingWorker.isOwner
      };

      const result = await updateWorker(editingWorker.id, workerData);
      
      if (result.success) {
        // Update local state
        const updatedWorkers = workers.map(worker =>
          worker.id === editingWorker.id
            ? {
                id: result.data.id,
                name: result.data.name,
                role: result.data.role,
                paymentRate: result.data.payment_rate,
                isOwner: result.data.is_owner
              }
            : worker
        );
        
        onWorkersUpdate(updatedWorkers);
        setEditingWorker(null);
        alert('Worker updated successfully! ✨ Saved to cloud database!');
      } else {
        alert('Error updating worker: ' + result.error + '\n\nFalling back to local storage...');
        
        // Fallback to local storage
        const updatedWorkers = workers.map(worker =>
          worker.id === editingWorker.id
            ? {
                ...worker,
                name: editingWorker.name.trim(),
                role: editingWorker.role.trim(),
                paymentRate: parseFloat(editingWorker.paymentRate)
              }
            : worker
        );

        onWorkersUpdate(updatedWorkers);
        setEditingWorker(null);
        alert('Worker updated locally! 📱');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWorker = async (workerId) => {
    const worker = workers.find(w => w.id === workerId);
    
    if (worker.isOwner) {
      alert('Cannot delete the owner account 👑');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${worker.name}? This action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await deleteWorker(workerId);
      
      if (result.success) {
        // Remove from local state
        const updatedWorkers = workers.filter(w => w.id !== workerId);
        onWorkersUpdate(updatedWorkers);
        alert('Worker deleted successfully! 🗑️ Removed from cloud database!');
      } else {
        alert('Error deleting worker: ' + result.error + '\n\nFalling back to local storage...');
        
        // Fallback to local storage
        const updatedWorkers = workers.filter(w => w.id !== workerId);
        onWorkersUpdate(updatedWorkers);
        alert('Worker deleted locally! 📱');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    
    if (isEditing) {
      setEditingWorker(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewWorker(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="form-container">
      {/* Add New Worker */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Add New Worker</h2>
            <p className="card-subtitle">Manage your team and their payment rates</p>
          </div>
        </div>

        <form onSubmit={handleAddWorker} className="card-content">
          <div className="form-group">
            <label className="form-label">
              <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Worker Name
            </label>
            <input
              type="text"
              name="name"
              value={newWorker.name}
              onChange={(e) => handleChange(e, false)}
              className="form-input"
              placeholder="Enter worker's full name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role/Position</label>
            <input
              type="text"
              name="role"
              value={newWorker.role}
              onChange={(e) => handleChange(e, false)}
              className="form-input"
              placeholder="e.g., Assistant, Junior Artist, Hair Stylist"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <DollarSign size={16} style={{ display: 'inline', marginRight: '8px' }} />
              Payment Rate per Service (₹)
            </label>
            <input
              type="number"
              name="paymentRate"
              value={newWorker.paymentRate}
              onChange={(e) => handleChange(e, false)}
              className="form-input"
              placeholder="e.g., 800"
              min="0"
              step="50"
              required
              disabled={isSubmitting}
            />
            <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '4px' }}>
              This is the fixed amount you pay this worker per service, regardless of client pricing
            </small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <Plus size={20} />
            {isSubmitting ? 'Adding Worker... ⏳' : 'Add Worker 👥'}
          </button>
          
          {isSubmitting && (
            <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '8px' }}>
              ☁️ Saving to cloud database...
            </p>
          )}
        </form>
      </div>

      {/* Workers List */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Your Team</h2>
            <p className="card-subtitle">{workers.length} team member{workers.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="card-content">
          {workers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>No Workers Added</h3>
              <p>Add your first team member to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {workers.map(worker => (
                <div key={worker.id} className="member-detail">
                  {editingWorker && editingWorker.id === worker.id ? (
                    // Edit Mode
                    <div>
                      <div className="member-header">
                        <h4 className="member-title">Edit Worker</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={handleSaveEdit}
                            className="btn btn-small btn-success"
                            disabled={isSubmitting}
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => setEditingWorker(null)}
                            className="btn btn-small btn-secondary"
                            disabled={isSubmitting}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editingWorker.name}
                            onChange={(e) => handleChange(e, true)}
                            className="form-input"
                            disabled={worker.isOwner || isSubmitting}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Role</label>
                          <input
                            type="text"
                            name="role"
                            value={editingWorker.role}
                            onChange={(e) => handleChange(e, true)}
                            className="form-input"
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Payment Rate (₹)</label>
                          <input
                            type="number"
                            name="paymentRate"
                            value={editingWorker.paymentRate}
                            onChange={(e) => handleChange(e, true)}
                            className="form-input"
                            min="0"
                            step="50"
                            disabled={isSubmitting}
                            disabled={worker.isOwner}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div>
                      <div className="member-header">
                        <div>
                          <h4 className="member-title">
                            {worker.name}
                            {worker.isOwner && (
                              <span style={{ 
                                marginLeft: '8px', 
                                fontSize: '0.75rem', 
                                background: '#fef3c7', 
                                color: '#d97706', 
                                padding: '2px 8px', 
                                borderRadius: '12px',
                                fontWeight: '600'
                              }}>
                                OWNER
                              </span>
                            )}
                          </h4>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEditWorker(worker)}
                            className="btn btn-small btn-secondary"
                            disabled={isSubmitting}
                          >
                            <Edit2 size={16} />
                          </button>
                          {!worker.isOwner && (
                            <button
                              onClick={() => handleDeleteWorker(worker.id)}
                              className="btn btn-small btn-danger"
                              disabled={isSubmitting}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-label">Role</span>
                          <span className="info-value">{worker.role}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Payment Rate</span>
                          <span className="info-value">
                            {worker.isOwner ? 'Owner' : `₹${worker.paymentRate} per service`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Structure Info */}
      <div className="card" style={{ background: '#f0f9ff', border: '2px solid #bae6fd' }}>
        <div className="card-content">
          <h3 style={{ color: '#0369a1', marginBottom: '12px', fontSize: '1rem', fontWeight: '700' }}>
            💡 How Payment Works
          </h3>
          <div style={{ color: '#0c4a6e', fontSize: '0.875rem', lineHeight: '1.5' }}>
            <p style={{ marginBottom: '8px' }}>
              <strong>Client Pricing:</strong> You charge clients based on your service rates (e.g., ₹2500 for Semi HD Makeup)
            </p>
            <p style={{ marginBottom: '8px' }}>
              <strong>Worker Payment:</strong> You pay workers their fixed rate per service (e.g., ₹800 per service)
            </p>
            <p>
              <strong>Your Profit:</strong> Client payment minus worker payment (e.g., ₹2500 - ₹800 = ₹1700 profit)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkersManager;
