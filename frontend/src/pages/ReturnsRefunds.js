// src/pages/ReturnsRefunds.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/ReturnsRefunds.css'; // Optional for custom styles

const ReturnsRefunds = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Column: Image */}
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <img
            src="/media/images/ferret-banner.png"
            alt="Returns and Refunds"
            className="img-fluid rounded shadow"
            style={{ maxWidth: '400px' }}
          />
        </div>

        {/* Right Column: Text */}
        <div className="col-md-7">
          <h2 className="mb-4">🔁 Returns & Refunds</h2>

          <div className="mb-3">
            <h5 className="text-primary">📦 Return Policy</h5>
            <p>
              If you're not fully satisfied with your purchase, you may return unused, unopened items within
              <strong> 14 days </strong> of receipt for a full refund.
            </p>
          </div>

          <div className="mb-3">
            <h5 className="text-primary">✅ Return Conditions</h5>
            <ul className="list-unstyled ps-3">
              <li>• Items must be returned in original packaging.</li>
              <li>• Returns must include proof of purchase.</li>
              <li>• Opened or used products are not eligible unless faulty.</li>
            </ul>
          </div>

          <div className="mb-3">
            <h5 className="text-primary">💰 Refund Process</h5>
            <p>
              Once your return is received and inspected, we’ll notify you via email and process the refund
              to your original payment method within <strong>5–7 business days</strong>.
            </p>
          </div>

          <div className="mb-3">
            <h5 className="text-primary">🔄 Exchanges</h5>
            <p>
              We currently do not offer direct exchanges. Please return the product and place a new order if needed.
            </p>
          </div>

          <div>
            <h5 className="text-primary">📧 Contact for Returns</h5>
            <p>
              Email us at <a href="mailto:returns@wildpawpantry.com">returns@wildpawpantry.com</a> for a return authorization and instructions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsRefunds;
