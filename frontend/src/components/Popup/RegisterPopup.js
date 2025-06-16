// src/components/Popup/RegisterPopup.js
import React from 'react';
import './css/RegisterPopup.css'; // Optional if styles are separate

const RegisterPopup = () => (
  <div className="popup-overlay">
    <div className="popup-box text-center">
      <img
        src="/media/images/corgi_register.png"
        alt="Welcome corgi"
        className="popup-corgi"
      />
      <h5>🎉 Registration Successful!</h5>
      <p>Redirecting to login...</p>
    </div>
  </div>
);

export default RegisterPopup;
