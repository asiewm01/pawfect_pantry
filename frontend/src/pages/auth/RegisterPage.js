import React, { useState } from 'react';
import axios from 'axios';
import './css/Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setShowPopup(false);

    const { username, email, password1, password2, first_name, last_name } = formData;

    if (password1 !== password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/register/`, {
        username,
        email,
        password: password1,
        first_name,
        last_name
      }, {
        withCredentials: true
      });

      if (response.status === 201) {
        setShowPopup(true);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light register-wrapper">
      <div className="row w-100" style={{ maxWidth: '1000px' }}>

        {/* Left side image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/media/images/register-banner.png"
            alt="Register Banner"
            className="img-fluid w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Right side form */}
        <div className="col-md-6 bg-white p-5 shadow-sm rounded position-relative">
          <h2 className="text-center mb-4">Create Account</h2>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input name="username" className="form-control" value={formData.username} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" name="password1" className="form-control" value={formData.password1} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="password2" className="form-control" value={formData.password2} onChange={handleChange} required />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-success">Register</button>
            </div>
          </form>

          {/* Success Popup */}
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-box">
                ✅ Registration successful! Redirecting to login...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
