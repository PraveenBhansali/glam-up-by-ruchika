import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      default:
        return <CheckCircle size={20} />;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      padding: '16px 20px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '400px',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
        };
      case 'error':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
        };
      default:
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
        };
    }
  };

  return (
    <div style={getStyles()}>
      {getIcon()}
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.8,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.8'}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
