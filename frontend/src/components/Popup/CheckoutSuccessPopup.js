import React, { useEffect } from 'react';
import './css/CheckoutSuccessPopup.css';

const CheckoutSuccessPopup = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
      window.location.reload();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleOkClick = () => {
    onClose();
    window.location.reload();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box text-center">
        <img
          src="/media/images/corgi_happy.png"
          alt="Corgi celebrating"
          className="popup-corgi mb-3"
        />
        <h4>🎉 Order Confirmed! Please check your email!</h4>
        <button className="btn btn-primary mt-3" onClick={handleOkClick}>
          OK
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPopup;

