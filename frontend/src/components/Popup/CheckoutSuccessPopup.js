import React, { useEffect } from 'react';
import './css/CheckoutSuccessPopup.css';

const CheckoutSuccessPopup = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      handleOkClick();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleOkClick = () => {
    onClose();
    window.location.reload();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box square-popup text-center">
        <img
          src="/media/images/corgi_butt.png"
          alt="Corgi celebrating"
          className="popup-corgi mb-3"
        />
        <h4>🎉 Order Confirmed!</h4>
        <p>Please check your email for confirmation.</p>
        <button className="btn btn-primary mt-3" onClick={handleOkClick}>
          OK
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPopup;

