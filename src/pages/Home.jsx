import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkHealth } from '../services/api';

function Home() {
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth()
      .then(data => setHealth(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Custom Header for Home */}
      <header style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>HealthTrack</h1>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: 'white',
                color: '#007bff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Register
            </button>
          </nav>
        </div>
      </header>

      {/* Home Content */}
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Welcome to HealthTrack Fitness Tracker</h2>
        <p>Track workouts, meals, and daily steps</p>
        
        {loading && <p>Loading...</p>}
        {health && (
          <div style={{ 
            background: '#e8f5e9', 
            padding: '20px', 
            borderRadius: '8px', 
            marginTop: '20px' 
          }}>
            <p>✅ Status: {health.status}</p>
            <p>📝 {health.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
