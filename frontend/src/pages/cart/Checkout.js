import React, { useState, useEffect } from 'react';
import './css/Checkout.css';
import axios from '../../axiosSetup';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    note: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/cart/`, {
          withCredentials: true,
        });

        const items = res.data.cart;
        const total = res.data.total;

        setCartItems(items);
        setCartTotal(total);
      } catch (err) {
        console.error('Failed to load cart', err);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/cart/checkout/`, {
        ...formData,
        payment_method: paymentMethod,
      }, {
        withCredentials: true
      });

      console.log(response.data);
      setShowPopup(true);

      // Redirect to order history after 4 seconds
      setTimeout(() => {
        navigate('/orders/history');
      }, 4000);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container container">
      <h2 className="text-center mb-4">💳 Checkout</h2>
      <div className="row">
        {/* 🧾 Order Summary */}
        <div className="col-md-6 order-summary">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <table className="summary-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"><strong>Total</strong></td>
                  <td><strong>${cartTotal.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* 🧍 Personal Details & Payment */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label htmlFor="address">Shipping Address</label>
            <textarea
              name="address"
              rows="4"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>

            <label htmlFor="note">Additional Notes (Optional)</label>
            <textarea
              name="note"
              rows="3"
              value={formData.note}
              onChange={handleChange}
            ></textarea>

            <div className="payment-selection mt-3">
              <label htmlFor="payment_method"><strong>Select Payment Method:</strong></label>
              <select
                id="payment_method"
                name="payment_method"
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div className="payment-methods mt-4">
              <p>We accept:</p>
              <div className="logos">
                <img src="/media/images/payment/stripe.png" alt="Stripe" />
                <img src="/media/images/payment/paypal.png" alt="PayPal" />
                <img src="/media/images/payment/visa.png" alt="Visa" />
                <img src="/media/images/payment/mastercard.png" alt="Mastercard" />
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mt-3" disabled={loading}>
              {loading ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </form>
        </div>
      </div>

      {/* ✅ Order Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box text-center">
            <img
              src="/media/images/corgi_happy.png"
              alt="Corgi celebrating"
              className="popup-corgi"
            />
            <h4>🎉 Order Confirmed!</h4>
            <p>Please check your email for confirmation.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
