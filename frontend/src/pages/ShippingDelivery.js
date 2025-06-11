// src/pages/ShippingDelivery.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/ShippingDelivery.css'; // Optional if you want to customize further

const ShippingDelivery = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Column: Image */}
        <div className="col-md-5 mb-4 mb-md-0 text-center">
          <img
            src="/media/images/caique.png"
            alt="Shipping"
            className="img-fluid rounded shadow"
            style={{ maxWidth: '300px' }}
          />
        </div>

        {/* Right Column: Text Content */}
        <div className="col-md-7">
          <h2 className="mb-4">📦 Shipping & Delivery</h2>

          <div className="mb-3">
            <h5 className="text-primary">🚚 Shipping Times</h5>
            <p>
              Orders are processed within <strong>1–2 business days</strong>.
              Shipping typically takes <strong>3–7 business days</strong> within the continental U.S.
            </p>
          </div>

          <div className="mb-3">
            <h5 className="text-primary">🚛 Shipping Methods</h5>
            <ul className="list-unstyled ps-3">
              <li>• Standard Ground (3–7 business days)</li>
              <li>• Expedited (1–3 business days)</li>
              <li>• Local Pickup available in select areas</li>
            </ul>
          </div>

          <div className="mb-3">
            <h5 className="text-primary">📍 Tracking Your Order</h5>
            <p>
              Once shipped, you will receive a tracking number via email. You can track your shipment
              directly from your account dashboard or the courier’s website.
            </p>
          </div>

          <div className="mb-3">
            <h5 className="text-primary">📬 Delivery Notes</h5>
            <p>
              Please ensure someone is available to receive the delivery if required.
              We are not responsible for lost packages once marked as delivered.
            </p>
          </div>

          <div>
            <h5 className="text-primary">❌ Shipping Restrictions</h5>
            <p>
              We currently ship within the United States only.
              No shipments to P.O. Boxes, military addresses, or international destinations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
