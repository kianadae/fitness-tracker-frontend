import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById, updateActivity } from '../services/api';

function EditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: 1,
    type: 'Workout',
    name: '',
    description: '',
    date: '',
    status: 'Planned',
    durationMinutes: '',
    calories: '',
    stepsCount: '',
    mealType: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await getActivityById(id);
        setFormData({
          userId: data.userId,
          type: data.type,
          name: data.name,
          description: data.description || '',
          date: data.date.split('T')[0],
          status: data.status,
          durationMinutes: data.durationMinutes || '',
          calories: data.calories || '',
          stepsCount: data.stepsCount || '',
          mealType: data.mealType || ''
        });
      } catch (fetchError) {
        console.error('Failed to load activity:', fetchError);
        setError('Failed to load activity. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    // Validate type-specific fields
    if (formData.type === 'Workout') {
      if (formData.durationMinutes && formData.durationMinutes <= 0) {
        errors.durationMinutes = 'Duration must be greater than 0';
      }
      if (formData.calories && formData.calories <= 0) {
        errors.calories = 'Calories must be greater than 0';
      }
    }
    
    if (formData.type === 'Meal') {
      if (formData.calories && formData.calories <= 0) {
        errors.calories = 'Calories must be greater than 0';
      }
    }
    
    if (formData.type === 'Steps') {
      if (formData.stepsCount && formData.stepsCount <= 0) {
        errors.stepsCount = 'Step count must be greater than 0';
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);

    try {
      const payload = {
        ...formData,
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : null,
        calories: formData.calories ? parseInt(formData.calories) : null,
        stepsCount: formData.stepsCount ? parseInt(formData.stepsCount) : null,
      };

      await updateActivity(id, payload);
      setSuccessMessage('Activity updated successfully!');
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate(`/activities/${id}`);
      }, 1500);
    } catch (updateError) {
      console.error('Failed to update activity:', updateError);
      setError(updateError.message || 'Failed to update activity. Please try again.');
    } finally {
      setSaving(false);
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
        Loading activity...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '50px auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>Edit Activity</h2>
        <button
          onClick={() => navigate(`/activities/${id}`)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Back to Details
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          color: '#dc3545', 
          backgroundColor: '#fee',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div style={{ 
          color: '#28a745', 
          backgroundColor: '#d4edda',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #c3e6cb'
        }}>
          ✓ {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Type (Disabled) */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Type:
          </label>
          <select
            name="type"
            value={formData.type}
            disabled
            style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: '#e9ecef',
              cursor: 'not-allowed',
              color: '#6c757d',
              border: '1px solid #ced4da',
              borderRadius: '4px'
            }}
          >
            <option value="Workout">Workout</option>
            <option value="Meal">Meal</option>
            <option value="Steps">Steps</option>
          </select>
          <small style={{ color: '#6c757d', fontSize: '12px' }}>
            Activity type cannot be changed
          </small>
        </div>

        {/* Name */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Name: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '8px',
              border: fieldErrors.name ? '1px solid #dc3545' : '1px solid #ced4da',
              borderRadius: '4px'
            }}
          />
          {fieldErrors.name && (
            <small style={{ color: '#dc3545', fontSize: '12px' }}>
              {fieldErrors.name}
            </small>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Date */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Date: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '8px',
              border: fieldErrors.date ? '1px solid #dc3545' : '1px solid #ced4da',
              borderRadius: '4px'
            }}
          />
          {fieldErrors.date && (
            <small style={{ color: '#dc3545', fontSize: '12px' }}>
              {fieldErrors.date}
            </small>
          )}
        </div>

        {/* Status */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
            Status:
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid #ced4da',
              borderRadius: '4px'
            }}
          >
            <option value="Planned">Planned</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Conditional Fields - Workout */}
        {formData.type === 'Workout' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Duration (minutes):
              </label>
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                min="1"
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: fieldErrors.durationMinutes ? '1px solid #dc3545' : '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
              {fieldErrors.durationMinutes && (
                <small style={{ color: '#dc3545', fontSize: '12px' }}>
                  {fieldErrors.durationMinutes}
                </small>
              )}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Calories:
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                min="1"
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: fieldErrors.calories ? '1px solid #dc3545' : '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
              {fieldErrors.calories && (
                <small style={{ color: '#dc3545', fontSize: '12px' }}>
                  {fieldErrors.calories}
                </small>
              )}
            </div>
          </>
        )}

        {/* Conditional Fields - Meal */}
        {formData.type === 'Meal' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Meal Type:
              </label>
              <select
                name="mealType"
                value={formData.mealType}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              >
                <option value="">Select...</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
                Calories:
              </label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                min="1"
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: fieldErrors.calories ? '1px solid #dc3545' : '1px solid #ced4da',
                  borderRadius: '4px'
                }}
              />
              {fieldErrors.calories && (
                <small style={{ color: '#dc3545', fontSize: '12px' }}>
                  {fieldErrors.calories}
                </small>
              )}
            </div>
          </>
        )}

        {/* Conditional Fields - Steps */}
        {formData.type === 'Steps' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
              Steps Count:
            </label>
            <input
              type="number"
              name="stepsCount"
              value={formData.stepsCount}
              onChange={handleChange}
              min="1"
              style={{ 
                width: '100%', 
                padding: '8px',
                border: fieldErrors.stepsCount ? '1px solid #dc3545' : '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
            {fieldErrors.stepsCount && (
              <small style={{ color: '#dc3545', fontSize: '12px' }}>
                {fieldErrors.stepsCount}
              </small>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
          <button 
            type="submit" 
            disabled={saving}
            style={{ 
              flex: 1,
              padding: '12px', 
              backgroundColor: saving ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          <button 
            type="button"
            onClick={() => navigate(`/activities/${id}`)}
            disabled={saving}
            style={{ 
              flex: 1,
              padding: '12px', 
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditActivity;