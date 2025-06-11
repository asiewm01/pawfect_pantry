import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './css/LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.get('https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/csrf/', {
        withCredentials: true
      });

      const response = await axios.post('https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/login/', {
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
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100" style={{ maxWidth: '960px' }}>
        
        {/* Left Image Column */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/media/images/login-banner.png"
            alt="Login"
            className="img-fluid w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Login Form Column */}
        <div className="col-md-6 bg-white p-4 shadow-sm d-flex flex-column justify-content-center">
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger text-center py-2">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>

          <div className="text-center mt-3">
            <p>
              Don’t have an account? <Link to="/register">Register</Link><br />
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
