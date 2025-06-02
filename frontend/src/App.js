import React from 'react';
import { Routes, Route } from 'react-router-dom';

import BaseLayout from './components/BaseLayout';
import AppInit from './components/AppInit'; // ✅ new

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Dashboard from './pages/auth/Dashboard';

import Home from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Sitemap from './pages/Sitemap';
import CustomerSupport from './pages/CustomerSupport';
import ShippingDelivery from './pages/ShippingDelivery';
import ReturnRefunds from './pages/ReturnsRefunds';
import ProductList from './pages/catalogue/ProductList';
import ProductDetail from './pages/catalogue/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/cart/Checkout';
import OrderHistory from './pages/order/OrderHistory';
import OrderDetail from './pages/order/OrderDetail';
import SearchResults from './components/SearchResult';
import ChatbotWidget from './components/ChatbotWidget'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import OrderTracking from './pages/order/OrderTracking'; 

function App() {
  return (
    <>
      <AppInit />
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="sitemap" element={<Sitemap />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="delivery" element={<ShippingDelivery />} />
          <Route path="refunds" element={<ReturnRefunds />} />
          <Route path="catalogue" element={<ProductList />} />
          <Route path="catalogue/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="/orders/history" element={<OrderHistory />} />
          <Route path="/orders/tracking" element={<OrderTracking />} />
          <Route path="/orders/detail/:id" element={<OrderDetail />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
      </Routes>

      {/* ✅ Chatbot appears on all pages */}
      <ChatbotWidget />
    </>
  );
}

export default App;