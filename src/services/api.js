const API_BASE_URL = 'http://localhost:5110/api';

/* ------------------ User APIs ------------------ */
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  return await response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  return await response.json();
};

/* ------------------ Activity APIs ------------------ */
export const createActivity = async (activityData) => {
  const response = await fetch(`${API_BASE_URL}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData),
  });
  if (!response.ok) throw new Error('Failed to create activity');
  return await response.json();
};

export const getAllActivities = async (type = '', status = '') => {
  let url = `${API_BASE_URL}/activities`;
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  if (params.toString()) url += `?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch activities');
  return await response.json();
};

export const getActivityById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/activities/${id}`);
  if (!response.ok) throw new Error('Activity not found');
  return await response.json();
};

export const updateActivity = async (id, activityData) => {
  const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activityData),
  });
  if (!response.ok) throw new Error('Failed to update activity');
  return await response.json();
};

export const updateActivityStatus = async (id, status) => {
  const response = await fetch(`${API_BASE_URL}/activities/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update status');
  return await response.json();
};

export const deleteActivity = async (id) => {
  const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete activity');
  return true;
};

export const getUserActivities = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/activities/user/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user activities');
  return await response.json();
};

export const getActivitiesByDateRange = async (startDate, endDate) => {
  const response = await fetch(
    `${API_BASE_URL}/activities/range?startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) throw new Error('Failed to fetch activities');
  return await response.json();
};

/* ------------------ Health Check ------------------ */
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error('API health check failed');
  return await response.json();
};


/* ------------------ Health Check ------------------ */
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error('API health check failed');
  return await response.json();
};

export default {
  registerUser,
  loginUser,
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  updateActivityStatus,
  deleteActivity,
  getUserActivities,
  getActivitiesByDateRange,
  checkHealth,
};
};
