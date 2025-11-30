import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createActivity } from '../services/api';

function CreateActivity() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: 1, // Get from logged-in user context
    type: 'Workout',
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Planned',
    durationMinutes: '',
    calories: '',
    stepsCount: '',
    mealType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert numeric fields
      const payload = {
        ...formData,
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : null,
        calories: formData.calories ? parseInt(formData.calories) : null,
        stepsCount: formData.stepsCount ? parseInt(formData.stepsCount) : null,
      };

      await createActivity(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Create New Activity</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="Workout">Workout</option>
            <option value="Meal">Meal</option>
            <option value="Steps">Steps</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        {/* Conditional fields based on type */}
        {formData.type === 'Workout' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label>Duration (minutes):</label>
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Calories:</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </>
        )}

        {formData.type === 'Meal' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label>Meal Type:</label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="">Select...</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Calories:</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
          </>
        )}

        {formData.type === 'Steps' && (
          <div style={{ marginBottom: '15px' }}>
            <label>Steps Count:</label>
            <input
              type="number"
              name="stepsCount"
              value={formData.stepsCount}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              flex: 1,
              padding: '10px', 
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Activity'}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/dashboard')}
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
      </form>
    </div>
  );
}

export default CreateActivity;
