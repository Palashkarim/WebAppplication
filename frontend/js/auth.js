const API_URL = 'http://localhost:3001/api';

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
};

export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_URL}/user`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};