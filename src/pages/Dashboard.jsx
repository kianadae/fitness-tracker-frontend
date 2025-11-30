import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllActivities, getActivitiesByDateRange } from '../services/api';
import StatusUpdater from '../components/StatusUpdater';

function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ 
    type: '', 
    status: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Use date range filter if both dates are provided
        if (filter.startDate && filter.endDate) {
          const data = await getActivitiesByDateRange(filter.startDate, filter.endDate);
          // Apply type and status filters client-side
          let filtered = data;
          if (filter.type) filtered = filtered.filter(a => a.type === filter.type);
          if (filter.status) filtered = filtered.filter(a => a.status === filter.status);
          setActivities(filtered);
        } else {
          // Use regular filters
          const data = await getAllActivities(filter.type, filter.status);
          setActivities(data);
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [filter]);

  const handleStatusUpdate = (activityId, newStatus) => {
    // Optimistic update: Update the activity in the list immediately
    setActivities(activities.map(a => 
      a.id === activityId ? { ...a, status: newStatus } : a
    ));
  };

  const clearFilters = () => {
    setFilter({ type: '', status: '', startDate: '', endDate: '' });
  };

  const hasActiveFilters = filter.type || filter.status || filter.startDate || filter.endDate;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Workout': return '💪';
      case 'Meal': return '🍽️';
      case 'Steps': return '👟';
      default: return '📝';
    }
  };

  // Calculate stats
  const stats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'Completed').length,
    inProgress: activities.filter(a => a.status === 'InProgress').length,
    planned: activities.filter(a => a.status === 'Planned').length
  };

  return (
    <div style={{ padding: '20px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h1 style={{ margin: 0 }}>Activity Dashboard</h1>
        <button
          onClick={() => navigate('/create-activity')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          ➕ Create New Activity
        </button>
      </div>

      {/* Enhanced Filters */}
      <div style={{ 
        marginBottom: '25px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>🔍 Filters</h3>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              style={{ 
                padding: '6px 12px', 
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Clear All
            </button>
          )}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          {/* Type Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px',
              fontWeight: '500',
              color: '#495057'
            }}>
              Type:
            </label>
            <select 
              value={filter.type} 
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da',
                fontSize: '14px',
                backgroundColor: filter.type ? '#e7f3ff' : 'white'
              }}
            >
              <option value="">All Types</option>
              <option value="Workout">💪 Workout</option>
              <option value="Meal">🍽️ Meal</option>
              <option value="Steps">👟 Steps</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px',
              fontWeight: '500',
              color: '#495057'
            }}>
              Status:
            </label>
            <select 
              value={filter.status} 
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da',
                fontSize: '14px',
                backgroundColor: filter.status ? '#e7f3ff' : 'white'
              }}
            >
              <option value="">All Status</option>
              <option value="Planned">📋 Planned</option>
              <option value="InProgress">⏳ In Progress</option>
              <option value="Completed">✅ Completed</option>
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px',
              fontWeight: '500',
              color: '#495057'
            }}>
              Start Date:
            </label>
            <input 
              type="date"
              value={filter.startDate} 
              onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da',
                fontSize: '14px',
                backgroundColor: filter.startDate ? '#e7f3ff' : 'white'
              }}
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '6px', 
              fontSize: '14px',
              fontWeight: '500',
              color: '#495057'
            }}>
              End Date:
            </label>
            <input 
              type="date"
              value={filter.endDate} 
              onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ced4da',
                fontSize: '14px',
                backgroundColor: filter.endDate ? '#e7f3ff' : 'white'
              }}
            />
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div style={{ marginTop: '12px', fontSize: '13px', color: '#6c757d' }}>
            <strong>Active filters:</strong>{' '}
            {filter.type && `Type: ${filter.type}`}
            {filter.type && (filter.status || filter.startDate) && ', '}
            {filter.status && `Status: ${filter.status}`}
            {filter.status && (filter.startDate || filter.endDate) && ', '}
            {filter.startDate && `From: ${filter.startDate}`}
            {filter.startDate && filter.endDate && ' '}
            {filter.endDate && `To: ${filter.endDate}`}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {!loading && activities.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '5px' }}>
              Total Activities
            </div>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#d4edda', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.completed}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '5px' }}>
              Completed
            </div>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>
              {stats.inProgress}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '5px' }}>
              In Progress
            </div>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8d7da', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6c757d' }}>
              {stats.planned}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '5px' }}>
              Planned
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#6c757d' }}>
          Loading activities...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#fee',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {/* Activities Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {activities.map((activity) => (
          <div
            key={activity.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: 'white',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Type Badge and Status Updater */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              gap: '10px'
            }}>
              <span style={{
                backgroundColor: '#e7f3ff',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#007bff'
              }}>
                {getTypeIcon(activity.type)} {activity.type}
              </span>

              <div onClick={(e) => e.stopPropagation()}>
                <StatusUpdater 
                  activityId={activity.id}
                  currentStatus={activity.status}
                  compact={true}
                  onStatusUpdated={(newStatus) => handleStatusUpdate(activity.id, newStatus)}
                />
              </div>
            </div>

            {/* Activity Content - Clickable */}
            <div 
              onClick={() => navigate(`/activities/${activity.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                {activity.name}
              </h3>
              <p style={{ 
                color: '#666', 
                fontSize: '14px', 
                margin: '0 0 12px 0',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {activity.description || 'No description'}
              </p>

              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#999',
                borderTop: '1px solid #eee',
                paddingTop: '10px'
              }}>
                <span>📅 {new Date(activity.date).toLocaleDateString()}</span>
                <span style={{ color: '#007bff', fontWeight: '500' }}>View Details →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activities.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '60px', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📭</div>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No activities found</h3>
          <p style={{ color: '#999', marginBottom: '20px' }}>
            {hasActiveFilters 
              ? 'Try adjusting your filters or create a new activity.' 
              : 'Create your first activity to get started!'}
          </p>
          <button
            onClick={() => navigate('/create-activity')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ➕ Create Activity
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;