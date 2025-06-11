// src/pages/CustomerSupport.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/CustomerSupport.css'; // Optional for extra styling

const CustomerSupport = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Column: Support Illustration */}
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img
            src="/media/images/guinea-pig-banner.png"
            alt="Customer Support"
            className="img-fluid rounded shadow"
            style={{ maxWidth: '300px' }}
          />
        </div>

        {/* Right Column: Support Info */}
        <div className="col-md-7">
          <h2 className="mb-4">💬 Customer Support</h2>

          <p>
            We’re here to help! If you need assistance with your order, product inquiries, or general feedback,
            our support team is available to assist you.
          </p>

          <div className="mb-3">
            <h5 className="text-primary">📞 How to Reach Us</h5>
            <ul className="list-unstyled ps-3">
              <li>• Email: <a href="mailto:support@wildpawpantry.com">support@wildpawpantry.com</a></li>
              <li>• Phone: +1 (800) 123-4567 (Mon–Fri, 9am–6pm EST)</li>
              <li>• Live Chat: Available on our website during business hours</li>
            </ul>
          </div>

          <div className="mb-3">
            <h5 className="text-primary">⚠️ Common Issues</h5>
            <ul className="list-unstyled ps-3">
              <li>• Missing or delayed orders</li>
              <li>• Returns and refunds</li>
              <li>• Feeding guidance for exotic pets</li>
              <li>• Product substitution or availability</li>
            </ul>
          </div>

          <div>
            <h5 className="text-primary">📝 Feedback & Complaints</h5>
            <p>
              Your feedback matters. If you’re not satisfied with your experience,
              please reach out directly so we can resolve the issue promptly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
