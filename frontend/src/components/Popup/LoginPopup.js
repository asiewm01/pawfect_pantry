import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LoginPopup.css';

const LoginPopup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/dashboard');
    setTimeout(() => window.location.reload(), 300);
    if (onClose) onClose();
  };

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal text-center">
        <img
          src="/media/images/corgi_login.png"
          alt="Welcome corgi"
          className="popup-corgi"
        />
        <h5>🔁 Please Refresh</h5>
        <p className="mb-3">
          After logging in, please refresh the page to fully access your Dashboard, Cart, Orders, and Help Desk.
        </p>
        <button className="btn btn-primary w-100" onClick={handleContinue}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default LoginPopup;
