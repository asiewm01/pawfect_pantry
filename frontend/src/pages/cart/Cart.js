import React, { useEffect, useState } from 'react';
import axios from '../../axiosSetup';
import './css/Cart.css';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const BLOB_BASE = "https://pawfectmediastore.blob.core.windows.net/media";


  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/cart/`, { withCredentials: true });
      const items = res.data.cart;
      setCartItems(items);

      const initialQuantities = items.reduce((acc, item) => {
        acc[item.product_id] = item.quantity;
        return acc;
      }, {});
      setQuantities(initialQuantities);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleUpdateCart = async () => {
    try {
      const payload = {
        items: Object.entries(quantities).map(([product_id, quantity]) => ({
          product_id: parseInt(product_id),
          quantity,
        }))
      };
      await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/cart/update/`, payload, { withCredentials: true });
      alert('Cart updated!');
      fetchCart();
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/cart/remove/${productId}/`, {}, { withCredentials: true });
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  return (
    <div className="cart-container container mt-4">
      <h2 className="mb-4">🛒 Your Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price ($)</th>
                <th>Subtotal ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td className="d-flex align-items-center">
                  <img
                    src={item.image?.url || `${BLOB_BASE}/${item.image}`}
                    alt={item.name}
                  />
                    {item.product_name}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={quantities[item.product_id]}
                      onChange={(e) =>
                        handleQuantityChange(item.product_id, parseInt(e.target.value))
                      }
                      className="form-control"
                      style={{ width: '80px' }}
                    />
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * quantities[item.product_id]).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemove(item.product_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-end mb-3">
            <h5><strong>Total: ${total.toFixed(2)}</strong></h5>
          </div>

          <div className="d-flex justify-content-between flex-wrap gap-2">
            <button className="btn btn-outline-primary" onClick={handleUpdateCart}>
              Update Cart
            </button>
            <Link to="/checkout" className="btn btn-success">
              Proceed to Checkout
            </Link>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
