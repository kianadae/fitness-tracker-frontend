import { useState } from 'react';
import { updateActivityStatus } from '../services/api';

function StatusUpdater({ activityId, currentStatus, onStatusUpdated, compact = false }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const statusOptions = [
    { value: 'Planned', label: 'Planned', color: '#6c757d', icon: '📋' },
    { value: 'InProgress', label: 'In Progress', color: '#ffc107', icon: '⏳' },
    { value: 'Completed', label: 'Completed', color: '#28a745', icon: '✅' }
  ];

  const handleStatusChange = async (newStatus) => {
    if (status === newStatus) return;

    // Optimistic UI update
    const previousStatus = status;
    setStatus(newStatus);
    setUpdating(true);
    setError('');

    try {
      await updateActivityStatus(activityId, newStatus);
      
      // Success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Notify parent component (triggers dashboard refresh)
      if (onStatusUpdated) {
        onStatusUpdated(newStatus);
      }
    } catch (err) {
      // Rollback on error
      setStatus(previousStatus);
      setError('Failed to update status. Please try again.');
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setUpdating(false);
    }
  };

  // Compact mode for dashboard cards (dropdown)
  if (compact) {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          style={{
            padding: '6px 24px 6px 10px',
            backgroundColor: statusOptions.find(opt => opt.value === status)?.color || '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: updating ? 'not-allowed' : 'pointer',
            opacity: updating ? 0.7 : 1,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 6px center'
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {updating && (
          <span style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '10px',
            color: '#6c757d'
          }}>
            <span className="spinner" style={{ 
              display: 'inline-block',
              animation: 'spin 1s linear infinite'
            }}>⟳</span>
          </span>
        )}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Full mode for activity details page (buttons)
  return (
    <div style={{ marginTop: '15px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '10px', 
        fontWeight: '500',
        fontSize: '16px',
        color: '#333'
      }}>
        Update Status:
      </label>

      {/* Error Message */}
      {error && (
        <div style={{ 
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          padding: '10px 12px',
          borderRadius: '4px',
          marginBottom: '10px',
          fontSize: '13px',
          border: '1px solid #f5c6cb',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div style={{ 
          color: '#155724',
          backgroundColor: '#d4edda',
          padding: '10px 12px',
          borderRadius: '4px',
          marginBottom: '10px',
          fontSize: '13px',
          border: '1px solid #c3e6cb',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.3s ease-in'
        }}>
          <span>✓</span>
          <span>Status updated successfully!</span>
        </div>
      )}

      {/* Status Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={updating}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: status === option.value ? `2px solid ${option.color}` : '2px solid #e9ecef',
              cursor: updating ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: status === option.value ? option.color : '#fff',
              color: status === option.value ? 'white' : '#495057',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: updating ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!updating && status !== option.value) {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = option.color;
              }
            }}
            onMouseLeave={(e) => {
              if (status !== option.value) {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.borderColor = '#e9ecef';
              }
            }}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
            {status === option.value && <span>✓</span>}
          </button>
        ))}
        
        {/* Loading Indicator */}
        {updating && (
          <span style={{ 
            fontSize: '14px', 
            color: '#6c757d',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span className="spinner" style={{ 
              display: 'inline-block',
              animation: 'spin 1s linear infinite'
            }}>⟳</span>
            <span>Updating...</span>
          </span>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default StatusUpdater;