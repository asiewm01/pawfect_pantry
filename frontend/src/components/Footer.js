import React from 'react';
import './css/Footer.css';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaFacebookMessenger, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-center text-lg-start bg-light text-muted mt-5">
      
      {/* Social Media Section */}
      <section className="footer-social d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Connect with us on social media:</span>
        </div>
<div className="social-icons">
  <a href="https://wa.me/+6592702017" className="me-4" target="_blank" rel="noopener noreferrer">
    <FaWhatsapp className="social-icon" />
  </a>
  <a href="https://www.messenger.com" className="me-4" target="_blank" rel="noopener noreferrer">
    <FaFacebookMessenger className="social-icon" />
  </a>
  <a href="https://facebook.com" className="me-4" target="_blank" rel="noopener noreferrer">
    <FaFacebookF className="social-icon" />
  </a>
  <a href="https://instagram.com" className="me-4" target="_blank" rel="noopener noreferrer">
    <FaInstagram className="social-icon" />
  </a>
  <a href="https://linkedin.com" className="me-4" target="_blank" rel="noopener noreferrer">
    <FaLinkedinIn className="social-icon" />
  </a>
  <a href="https://youtube.com" className="me-4" target="_blank" rel="noopener noreferrer">
    <FaYoutube className="social-icon" />
  </a>
</div>
      </section>

      {/* Footer Main Content */}
      <section>
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3">

            {/* Company Info */}
            <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <i className="fas fa-paw me-3"></i>PawFect Pantry Co.
              </h6>
              <p>
              "Providing loving pets and premium supplies. Trusted care for your furry friends."
              </p>
            </div>

            {/* Hidden Product Category */}
            <div className="col-md-4 col-lg-4 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Customer Service</h6>
              <p><a href="/delivery" className="text-reset">Shipping & Delivery</a></p>
              <p><a href="/refunds" className="text-reset">Returns & Refunds</a></p>
              <p><a href="/support" className="text-reset">Customer Support</a></p>
              <p><a href="/orders/tracking" className="text-reset">Track Your Order</a></p>
            </div>

            {/* Useful Links */}
            <div className="col-md-4 col-lg-4 col-xl-2 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Quick Links</h6>
              <p><a href="/faq" className="text-reset">FAQ</a></p>
              <p><a href="/privacy-policy" className="text-reset">Privacy Policy</a></p>
              <p><a href="/sitemap" className="text-reset">Sitemap</a></p>
              <p>
                <a
                  href={`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/vendor-panel/`}
                  className="text-reset"
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  Vendor Partner
                </a>
              </p>
            </div>

            {/* Contact Info */}
            <div className="col-md-4 col-lg-4 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p><i className="fas fa-home me-3"></i> 123 Marina Bay, Singapore</p>
              <p><i className="fas fa-envelope me-3"></i> info@pawfectpantry.com</p>
              <p><i className="fas fa-phone me-3"></i> +1 800-PAWFECTPANTRY</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Bottom */}
      <div className="text-center p-4 bg-primary text-white">
        © {new Date().getFullYear()} PawFect Pantry Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
