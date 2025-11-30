import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllActivities } from '../services/api';
import StatusDropdown from '../components/StatusDropdown';

function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ type: '', status: '' });

  // Use useCallback to memoize the fetch function and avoid unnecessary re-renders/fetches
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllActivities(filter.type, filter.status);
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [filter]); // Re-run effect when filter changes

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Handler to update the status of an activity in the local state
  const handleStatusUpdated = (activityId, newStatus) => {
    setActivities(prevActivities =>
      prevActivities.map(a =>
        a.id === activityId ? { ...a, status: newStatus } : a
      )
    );
  };

  // NOTE: This getStatusColor function is now redundant since StatusDropdown should handle coloring, 
  // but it is kept in case it's used elsewhere or for styling the dropdown itself.
  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return '#6c757d';
      case 'InProgress': return '#ffc107';
      case 'Completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* PAGE HEADER */}
      <h1 style={{ marginBottom: '10px' }}>Activity Dashboard</h1>

      {/* CREATE BUTTON under heading */}
      <div style={{ marginBottom: '25px' }}>
        <button
          onClick={() => navigate('/create-activity')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New Activity
        </button>
      </div>

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          style={{ padding: '8px' }}
        >
          <option value="">All Types</option>
          <option value="Workout">Workout</option>
          <option value="Meal">Meal</option>
          <option value="Steps">Steps</option>
        </select>

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          style={{ padding: '8px' }}
        >
          <option value="">All Status</option>
          <option value="Planned">Planned</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {loading && <p>Loading activities...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {activities.map((activity) => (
          <div
            key={activity.id}
            // Use this parent div for visual styling and mouse effects
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              cursor: 'pointer',
              transition: '0.2s ease',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = 'none')
            }
          >
            {/* Inner div contains card content, excluding the dropdown, and handles navigation click */}
            <div 
                onClick={() => navigate(`/activities/${activity.id}`)}
            >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#e7f3ff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {activity.type}
                  </span>

                  {/* NOTE: The original status badge is removed here. 
                      The StatusDropdown will now render the current status. */}

                </div>

                <h3>{activity.name}</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  {activity.description}
                </p>

                <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                  {new Date(activity.date).toLocaleDateString()}
                </p>
            </div>
            
            {/* StatusDropdown placed at the bottom of the card */}
            {/* Stop click propagation so clicking the dropdown doesn't trigger navigation */}
            <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '10px' }}>
                <StatusDropdown 
                  activityId={activity.id}
                  currentStatus={activity.status}
                  compact={true}
                  onStatusUpdated={handleStatusUpdated} // Use the centralized handler
                />
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {activities.length === 0 && !loading && !error && (
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#999' }}>
          <p>No activities found. Create your first activity!</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;