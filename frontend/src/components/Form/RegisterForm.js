// src/components/forms/RegisterForm.js
import React from 'react';
import './css/RegisterForm.css';

const RegisterForm = ({ formData, handleChange, handleRegister, error }) => {
  return (
<div style={{ width: '100%', maxWidth: '700px', padding: '0 .5rem' }}>
  <h2 className="text-center mb-3">Create Account</h2>
  {error && <div className="alert alert-danger text-center py-2">{error}</div>}

  <form onSubmit={handleRegister} className="register-form">

    <div className="form-field">
      <label className="form-label">Username</label>
      <input
        name="username"
        className="form-control"
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-field">
      <label className="form-label">Email</label>
      <input
        type="email"
        name="email"
        className="form-control"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>

    <div className="row">
      <div className="col-md-6 form-field">
        <label className="form-label">First Name</label>
        <input
          name="first_name"
          className="form-control"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="col-md-6 form-field">
        <label className="form-label">Last Name</label>
        <input
          name="last_name"
          className="form-control"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </div>
    </div>

    <div className="form-field">
      <label className="form-label">Password</label>
      <input
        type="password"
        name="password1"
        className="form-control"
        value={formData.password1}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-field">
      <label className="form-label">Confirm Password</label>
      <input
        type="password"
        name="password2"
        className="form-control"
        value={formData.password2}
        onChange={handleChange}
        required
      />
    </div>

    <div className="d-grid mt-3">
      <button type="submit" className="btn btn-success">Register</button>
    </div>

  </form>
</div>

  );
};

export default RegisterForm;
