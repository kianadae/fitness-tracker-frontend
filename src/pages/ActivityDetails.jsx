import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById, deleteActivity } from '../services/api';

function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const data = await getActivityById(id);
      setActivity(data);
    } catch (err) {
      setError('Failed to load activity details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteActivity(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete activity');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return '#6c757d';
      case 'InProgress': return '#ffc107';
      case 'Completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!activity) return <div style={{ padding: '20px' }}>Activity not found</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Activity Details</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Activity Card */}
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '30px',
        backgroundColor: '#f9f9f9'
      }}>
        {/* Type and Status Badges */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <span style={{ 
            backgroundColor: '#e7f3ff', 
            padding: '6px 12px', 
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {activity.type}
          </span>
          <span style={{ 
            backgroundColor: getStatusColor(activity.status), 
            color: 'white',
            padding: '6px 12px', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {activity.status}
          </span>
        </div>

        {/* Activity Name */}
        <h2 style={{ marginBottom: '10px' }}>{activity.name}</h2>
        
        {/* Description */}
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
          {activity.description || 'No description provided'}
        </p>

        {/* Details Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div>
            <strong>Date:</strong>
            <p>{new Date(activity.date).toLocaleDateString()}</p>
          </div>
          
          {activity.durationMinutes && (
            <div>
              <strong>Duration:</strong>
              <p>{activity.durationMinutes} minutes</p>
            </div>
          )}
          
          {activity.calories && (
            <div>
              <strong>Calories:</strong>
              <p>{activity.calories} kcal</p>
            </div>
          )}
          
          {activity.stepsCount && (
            <div>
              <strong>Steps:</strong>
              <p>{activity.stepsCount.toLocaleString()} steps</p>
            </div>
          )}
          
          {activity.mealType && (
            <div>
              <strong>Meal Type:</strong>
              <p>{activity.mealType}</p>
            </div>
          )}

          <div>
            <strong>Created:</strong>
            <p>{new Date(activity.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <strong>Last Updated:</strong>
            <p>{new Date(activity.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate(`/activities/${id}/edit`)}
            style={{ 
              flex: 1,
              padding: '12px', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Edit Activity
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            style={{ 
              flex: 1,
              padding: '12px', 
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Delete Activity
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this activity? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={handleDelete}
                style={{ 
                  flex: 1,
                  padding: '10px', 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{ 
                  flex: 1,
                  padding: '10px', 
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityDetails;
