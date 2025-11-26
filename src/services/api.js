import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const getActivities = async () => {
  const response = await api.get('/activities');
  return response.data;
};

export const createActivity = async (activityData) => {
  const response = await api.post('/activities', activityData);
  return response.data;
};

export const updateActivity = async (id, activityData) => {
  const response = await api.put(`/activities/${id}`, activityData);
  return response.data;
};

export const updateActivityStatus = async (id, status) => {
  const response = await api.patch(`/activities/${id}/status`, { status });
  return response.data;
};

export const deleteActivity = async (id) => {
  const response = await api.delete(`/activities/${id}`);
  return response.data;
};

export default api;
