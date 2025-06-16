import React from 'react';
import { Outlet } from 'react-router-dom';
import './css/BaseLayout.css';
import Navbar from './Navigation/NavigationBar'; // Import Navbar
import Footer from './Navigation/Footer'; // ✅ Import Footer
import HeaderBrand from '../components/Layout/HeaderBrand'; // adjust the path as needed

const BaseLayout = ({ user, setUser }) => {
  return (
    <>
      {/* Logo + Brand */}
      <HeaderBrand />

      {/* Navigation */}
      <Navbar user={user} setUser={setUser} /> {/* ✅ Pass setUser properly */}

      <hr className="m-0" />

      {/* Main Content */}
      <main className="container py-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Optional Chatbot */}
      {/* <ChatbotWidget /> */}

      {/* Bootstrap JS */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default BaseLayout;
