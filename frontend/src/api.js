const API_BASE = process.env.REACT_APP_API_URL || '/api';  // Use env variable if available, fallback to '/api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const fetchDashboard = async () => {
  try {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: getAuthHeader(),
    });

    if (!res.ok) throw new Error('Unauthorized or error occurred');
    return await res.json();
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
};

export const fetchUsername = async () => {
  try {
    const res = await fetch(`${API_BASE}/username`, {
      headers: getAuthHeader(),
    });

    if (!res.ok) throw new Error('Failed to fetch username');
    return await res.json();
  } catch (error) {
    console.error('Error fetching username:', error);
    throw error;
  }
};
