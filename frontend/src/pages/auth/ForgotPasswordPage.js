import React, { useState } from 'react';
import axios from 'axios';
import './css/ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/password/reset/`, {
        email
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setMessage('If your email exists, a reset link has been sent.');
      }
    } catch (err) {
      setError('Error sending reset email. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleReset}>
        <label>Email:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
