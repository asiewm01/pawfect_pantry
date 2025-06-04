import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './css/LoginPage.css'; // Adjust path if needed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Get CSRF token
      await axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/csrf/`, {
        withCredentials: true
      });

      // Perform login
      const response = await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/login/`, {
        username,
        password
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        alert('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>Username:</label><br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <label>Password:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Login</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Don’t have an account? <Link to="/register">Register</Link><br />
        <Link to="/forgot-password">Forgot Password?</Link><br />
      </p>
    </div>
  );
};

export default Login;
