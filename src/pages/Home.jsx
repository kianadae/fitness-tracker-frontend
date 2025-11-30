import { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

function Home() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth()
      .then(data => setHealth(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>HealthTrack Fitness Tracker</h1>
      <p>Track workouts, meals, and daily steps</p>
      
      {loading && <p>Loading...</p>}
      {health && (
        <div style={{ background: '#e8f5e9', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <p>✅ Status: {health.status}</p>
          <p>📝 {health.message}</p>
        </div>
      )}
    </div>
  );
}

export default Home;