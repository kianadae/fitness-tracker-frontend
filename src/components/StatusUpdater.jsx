import { useState } from 'react';
import { updateActivityStatus } from '../services/api';

function StatusUpdater({ activityId, currentStatus, onStatusUpdated }) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'Planned', label: 'Planned', color: '#6c757d' },
    { value: 'InProgress', label: 'In Progress', color: '#ffc107' },
    { value: 'Completed', label: 'Completed', color: '#28a745' }
  ];

  const handleStatusChange = async (newStatus) => {
    if (status === newStatus) return;

    const previousStatus = status;
    setStatus(newStatus);
    setUpdating(true);
    setError('');

    try {
      await updateActivityStatus(activityId, newStatus);
      if (onStatusUpdated) onStatusUpdated(newStatus);
      if (typeof window !== 'undefined') {
        // simple feedback, can replace with toast library
        alert(`Status updated to ${newStatus}`);
      }
    } catch (error) {
      setStatus(previousStatus);
      setError('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ marginTop: '15px' }}>
      {error && (
        <div style={{ color: 'red', fontSize: '13px', marginBottom: '8px' }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            disabled={updating}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              cursor: updating ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: status === option.value ? option.color : '#e9ecef',
              color: status === option.value ? 'white' : '#495057',
              transition: 'all 0.2s'
            }}
          >
            {option.label}
          </button>
        ))}
        {updating && (
          <span style={{ fontSize: '12px', color: '#666', alignSelf: 'center' }}>
            Updating...
          </span>
        )}
      </div>
    </div>
  );
}

export default StatusUpdater;
