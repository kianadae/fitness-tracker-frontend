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
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getActivityById(id);
        setActivity(data);
      } catch (error) {
        console.error('Failed to load activity:', err);
        setError('Failed to load activity details. Activity may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteActivity(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete activity');
      setShowDeleteConfirm(false);
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Workout': return '💪';
      case 'Meal': return '🍽️';
      case 'Steps': return '👟';
      default: return '📝';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        fontSize: '18px',
        marginTop: '50px'
      }}>
        Loading activity details...
      </div>
    );
  }

  // Error state (invalid ID or network error)
  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
        <div style={{ 
          color: '#dc3545', 
          fontSize: '18px',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#fee',
          borderRadius: '8px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Activity not found
  if (!activity) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
        <h2>Activity not found</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1 style={{ margin: 0 }}>Activity Details</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Activity Card */}
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        padding: '30px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Type and Status Badges */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span style={{ 
            backgroundColor: '#e7f3ff', 
            padding: '8px 16px', 
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#007bff'
          }}>
            {getTypeIcon(activity.type)} {activity.type}
          </span>
          <span style={{ 
            backgroundColor: getStatusColor(activity.status), 
            color: 'white',
            padding: '8px 16px', 
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {activity.status}
          </span>
        </div>

        {/* Activity Name */}
        <h2 style={{ marginBottom: '15px', fontSize: '28px' }}>{activity.name}</h2>
        
        {/* Description */}
        <div style={{ marginBottom: '30px' }}>
          <strong style={{ fontSize: '16px' }}>Description:</strong>
          <p style={{ color: '#666', fontSize: '16px', marginTop: '8px', lineHeight: '1.6' }}>
            {activity.description || 'No description provided'}
          </p>
        </div>

        {/* Details Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <div>
            <strong style={{ color: '#333' }}>📅 Date:</strong>
            <p style={{ marginTop: '5px', fontSize: '15px' }}>
              {new Date(activity.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          {/* Conditional fields based on activity type */}
          {activity.type === 'Workout' && activity.durationMinutes && (
            <div>
              <strong style={{ color: '#333' }}>⏱️ Duration:</strong>
              <p style={{ marginTop: '5px', fontSize: '15px' }}>
                {activity.durationMinutes} minutes
              </p>
            </div>
          )}
          
          {(activity.type === 'Workout' || activity.type === 'Meal') && activity.calories && (
            <div>
              <strong style={{ color: '#333' }}>🔥 Calories:</strong>
              <p style={{ marginTop: '5px', fontSize: '15px' }}>
                {activity.calories} kcal
              </p>
            </div>
          )}
          
          {activity.type === 'Steps' && activity.stepsCount && (
            <div>
              <strong style={{ color: '#333' }}>👟 Steps:</strong>
              <p style={{ marginTop: '5px', fontSize: '15px' }}>
                {activity.stepsCount.toLocaleString()} steps
              </p>
            </div>
          )}
          
          {activity.type === 'Meal' && activity.mealType && (
            <div>
              <strong style={{ color: '#333' }}>🍽️ Meal Type:</strong>
              <p style={{ marginTop: '5px', fontSize: '15px' }}>
                {activity.mealType}
              </p>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div style={{ 
          borderTop: '1px solid #eee', 
          paddingTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          fontSize: '14px',
          color: '#666'
        }}>
          <div>
            <strong>Created:</strong>
            <p style={{ marginTop: '5px' }}>
              {new Date(activity.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <strong>Last Updated:</strong>
            <p style={{ marginTop: '5px' }}>
              {new Date(activity.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginTop: '30px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => navigate(`/activities/${id}/edit`)}
            style={{ 
              flex: 1,
              minWidth: '150px',
              padding: '12px 20px', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ✏️ Edit Activity
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            style={{ 
              flex: 1,
              minWidth: '150px',
              padding: '12px 20px', 
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            🗑️ Delete Activity
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
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#dc3545' }}>
              ⚠️ Confirm Delete
            </h3>
            <p style={{ marginBottom: '25px', lineHeight: '1.6', color: '#666' }}>
              Are you sure you want to delete <strong>"{activity.name}"</strong>? 
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{ 
                  flex: 1,
                  padding: '10px', 
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '15px'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                style={{ 
                  flex: 1,
                  padding: '10px', 
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityDetails;