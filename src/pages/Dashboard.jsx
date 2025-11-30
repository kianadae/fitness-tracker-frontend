import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllActivities } from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ type: '', status: '' });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getAllActivities(filter.type, filter.status);
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [filter]);

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
            onClick={() => navigate(`/activities/${activity.id}`)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              cursor: 'pointer',
              transition: '0.2s ease'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = 'none')
            }
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

              <span
                style={{
                  backgroundColor: getStatusColor(activity.status),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {activity.status}
              </span>
            </div>

            <h3>{activity.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>
              {activity.description}
            </p>

            <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
              {new Date(activity.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {activities.length === 0 && !loading && (
        <div style={{ textAlign: 'center', marginTop: '40px', color: '#999' }}>
          <p>No activities found. Create your first activity!</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;