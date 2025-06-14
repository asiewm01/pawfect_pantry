import React, { useEffect } from 'react';
import './css/CartSuccessPopup.css';
import cartImg from '../../assets/images/cart_success.png';

const CartSuccessPopup = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Only closes popup, no reload
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleOkClick = () => {
    onClose(); // Still no reload
  };

  return (
    <div className="cart-success-backdrop">
      <div className="cart-success-box text-center">
        <img src={cartImg} alt="Cart Success" className="cart-success-image mb-3" />
        <p>{message}</p>
        <button className="btn btn-primary mt-2" onClick={handleOkClick}>
          OK
        </button>
      </div>
    </div>
  );
};

export default CartSuccessPopup;
