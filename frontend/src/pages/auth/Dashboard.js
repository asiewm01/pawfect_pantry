import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    new_password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user data on load
  useEffect(() => {
    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/user/`, {
      withCredentials: true
    }).then(res => {
      setUsername(res.data.username);
      setFormData(prev => ({
        ...prev,
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        email: res.data.email || ''
      }));
    }).catch(err => {
      console.warn('User not authenticated.');
      setUsername(null);
    }).finally(() => {
      setLoading(false);
    });

    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/profile/`, {
      withCredentials: true
    }).then(res => {
      setFormData(prev => ({
        ...prev,
        phone: res.data.phone || '',
        address: res.data.address || ''
      }));
    }).catch(err => {
      console.warn('Could not load user profile.');
    });
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userPayload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: username,
        phone: formData.phone,
        address: formData.address
      };

      await axios.put(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/profile/update/`, userPayload, {
        withCredentials: true
      });

      if (formData.new_password) {
        await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/password/change/`, {
          old_password: '', // not required in your backend
          new_password: formData.new_password
        }, { withCredentials: true });
      }

      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      setMessage('❌ Error updating profile.');
    }
  };

  if (loading) return <p className="text-center my-5">Loading dashboard...</p>;
  if (username === null) return <p className="text-center my-5 text-danger">You must be logged in to view the dashboard.</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-3">Welcome to your dashboard, {username}!</h2>
      <p className="text-muted">
        Please refresh the page to view access to Order History, Cart, and Dashboard on your navigation tab.
      </p>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row mt-4">
        {/* Left Column: Profile Picture */}
        <div className="col-md-4 text-center mb-4">
          <img
            src="/media/images/dashboard-banner.png"
            alt="Profile"
            className="img-fluid rounded-circle border border-secondary shadow"
          />
        </div>

        {/* Right Column: Form */}
        <div className="col-md-8">
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
