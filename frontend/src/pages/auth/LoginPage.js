import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './css/LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 🔐 Helper to get CSRF token from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showReminder, setShowReminder] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Step 1: Get CSRF token cookie
      await axios.get('https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/csrf/', {
        withCredentials: true
      });

      const csrftoken = getCookie('csrftoken');

      // Step 2: Login with CSRF token
      const response = await axios.post(
        'https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/login/',
        { username, password },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken
          }
        }
      );

      if (response.status === 200) {
        setShowReminder(true);
      }
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  return (
    <>
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="row w-100" style={{ maxWidth: '960px' }}>
          <div className="col-md-6 d-none d-md-block p-0">
            <img
              src="/media/images/login-banner.png"
              alt="Login"
              className="img-fluid w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>

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

      {showReminder && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5>🔁 Please Refresh</h5>
            <p className="mb-3">
              After logging in, please refresh the page to fully access your Dashboard, Cart, Orders, and Help Desk.
            </p>
            <button
              className="btn btn-primary w-100"
              onClick={() => {
                navigate('/dashboard');
                setTimeout(() => window.location.reload(), 300);
              }}
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
