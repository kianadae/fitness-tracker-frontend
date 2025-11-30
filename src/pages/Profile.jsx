import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserActivities } from '../services/api';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalActivities: 0,
    completedActivities: 0,
    inProgressActivities: 0,
    plannedActivities: 0,
    totalWorkouts: 0,
    totalMeals: 0,
    totalSteps: 0,
    totalCalories: 0,
    totalDuration: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Fetch user activities
        await fetchUserActivities(userData.userId);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchUserActivities = async (userId) => {
    try {
      const data = await getUserActivities(userId);
      setActivities(data);
      calculateStats(data);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      // Don't set error here - it's okay if activities fail to load
    }
  };

  const calculateStats = (activities) => {
    const totalActivities = activities.length;
    const completedActivities = activities.filter(a => a.status === 'Completed').length;
    
    const stats = {
      totalActivities,
      completedActivities,
      inProgressActivities: activities.filter(a => a.status === 'InProgress').length,
      plannedActivities: activities.filter(a => a.status === 'Planned').length,
      totalWorkouts: activities.filter(a => a.type === 'Workout').length,
      totalMeals: activities.filter(a => a.type === 'Meal').length,
      totalStepsEntries: activities.filter(a => a.type === 'Steps').length,
      totalSteps: activities.reduce((sum, a) => sum + (a.stepsCount || 0), 0),
      totalCalories: activities
        .filter(a => a.status === 'Completed')
        .reduce((sum, a) => sum + (a.calories || 0), 0),
      totalDuration: activities
        .filter(a => a.type === 'Workout' && a.status === 'Completed')
        .reduce((sum, a) => sum + (a.durationMinutes || 0), 0),
      completionRate: totalActivities > 0 
        ? Math.round((completedActivities / totalActivities) * 100) 
        : 0
    };
    setStats(stats);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#28a745';
      case 'InProgress': return '#ffc107';
      case 'Planned': return '#6c757d';
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
        Loading profile...
      </div>
    );
  }

  // Error state
  if (error || !user) {
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
          {error || 'Failed to load profile'}
        </div>
        <button 
          onClick={() => navigate('/login')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

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
        <h1 style={{ margin: 0 }}>My Profile</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '30px', 
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid #dee2e6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', flexWrap: 'wrap' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '40px',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>
              {user.firstName} {user.lastName}
            </h2>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '16px' }}>
              📧 {user.email}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#999' }}>
              🆔 User ID: {user.userId}
            </p>
            {user.createdAt && (
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#999' }}>
                📅 Member since: {new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>📈 Activity Statistics</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '15px'
        }}>
          {/* Total Activities */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e7f3ff', 
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px solid #007bff'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#007bff' }}>
              {stats.totalActivities}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              Total Activities
            </div>
          </div>

          {/* Completed */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#d4edda', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.completedActivities}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              ✅ Completed
            </div>
          </div>

          {/* In Progress */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#ffc107' }}>
              {stats.inProgressActivities}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              ⏳ In Progress
            </div>
          </div>

          {/* Planned */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8d7da', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#6c757d' }}>
              {stats.plannedActivities}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              📋 Planned
            </div>
          </div>

          {/* Workouts */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#cfe2ff', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#0d6efd' }}>
              {stats.totalWorkouts}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              💪 Total Workouts
            </div>
          </div>

          {/* Meals */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#d1ecf1', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#17a2b8' }}>
              {stats.totalMeals}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              🍽️ Meals Logged
            </div>
          </div>

          {/* Steps Entries */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e2e3e5', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#6c757d' }}>
              {stats.totalStepsEntries}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              👟 Steps Entries
            </div>
          </div>

          {/* Total Steps */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#d6d8db', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#495057' }}>
              {stats.totalSteps.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              👣 Total Steps
            </div>
          </div>

          {/* Calories */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#ffc0cb', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#dc3545' }}>
              {stats.totalCalories.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              🔥 Total Calories
            </div>
          </div>

          {/* Workout Duration */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#c3e6cb', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#28a745' }}>
              {stats.totalDuration}
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              ⏱️ Workout Minutes
            </div>
          </div>

          {/* Completion Rate */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff4e6', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#ff8c00' }}>
              {stats.completionRate}%
            </div>
            <div style={{ fontSize: '14px', color: '#495057', marginTop: '8px', fontWeight: '500' }}>
              📊 Completion Rate
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>📋 Recent Activities</h2>
          {activities.length > 0 && (
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              View All
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '15px' }}>🎯</div>
            <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No activities yet</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>
              Start tracking your fitness journey today!
            </p>
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
              ➕ Create First Activity
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activities.slice(0, 5).map((activity) => (
              <div 
                key={activity.id}
                onClick={() => navigate(`/activities/${activity.id}`)}
                style={{
                  padding: '18px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s',
                  backgroundColor: 'white',
                  gap: '15px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    marginBottom: '8px',
                    fontSize: '16px'
                  }}>
                    {getTypeIcon(activity.type)} {activity.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {activity.type} • {new Date(activity.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500',
                    backgroundColor: getStatusColor(activity.status),
                    color: 'white',
                    whiteSpace: 'nowrap'
                  }}>
                    {activity.status}
                  </span>
                  <span style={{ color: '#007bff', fontSize: '18px' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;