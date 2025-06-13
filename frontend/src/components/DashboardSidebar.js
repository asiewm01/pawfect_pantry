import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/DashboardSidebar.css';

const DashboardSidebar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/logout/`, {}, {
        withCredentials: true
      });
      if (setIsLoggedIn) setIsLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="dashboard-sidebar bg-light p-4 h-100">
      <h5 className="mb-4 fw-bold">My Dashboard</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <NavLink to="/dashboard" className="nav-link d-flex align-items-center">
            <i className="fas fa-user-circle me-2"></i> Profile
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/orders/history" className="nav-link d-flex align-items-center">
            <i className="fas fa-history me-2"></i> Order History
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/orders/tracking" className="nav-link d-flex align-items-center">
            <i className="fas fa-globe me-2"></i> Order Tracking
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/cart" className="nav-link d-flex align-items-center">
            <i className="fas fa-shopping-cart me-2"></i> Cart
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/nova" className="nav-link d-flex align-items-center">
            <i className="fas fa-headset me-2"></i> Frontdesk AI - Nova
          </NavLink>
        </li>
        <li className="nav-item mt-3">
          <button onClick={handleLogout} className="nav-link btn btn-link text-start text-danger p-0 d-flex align-items-center">
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
