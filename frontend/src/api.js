const API_BASE = '/api';

export const fetchDashboard = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Unauthorized or error occurred');
  return await res.json();
};

export const fetchUsername = async () => {
  const token = localStorage.getItem('token');

  const res = await fetch('/api/username', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Failed to fetch username');
  return await res.json();
};