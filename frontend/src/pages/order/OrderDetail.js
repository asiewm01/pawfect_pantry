import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axiosSetup';
import './css/OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    } else {
      setError('Invalid order ID.');
    }
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const res = await axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/orders/${id}/`, {
        withCredentials: true,
      });
      if (res.data?.order) {
        setOrder(res.data.order);
      } else {
        setError(res.data.error || 'No order data returned.');
      }
    } catch (err) {
      console.error('Failed to fetch order:', err);
      const message = err.response?.data?.error || 'Unable to fetch order details.';
      setError(message);
    }
  };

  if (error) {
    return (
      <div className="order-container">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!order) {
    return <div className="order-container">Loading...</div>;
  }

  return (
    <div className="order-container">
      <h2>🛍️ Order #{order.id}</h2>
      <p><span className="order-label">Date:</span> {new Date(order.date).toLocaleString()}</p>
      <p><span className="order-label">Status:</span> {order.status}</p>
      <p><span className="order-label">Total:</span> <span className="order-highlight">${order.total?.toFixed(2)}</span></p>

      <div className="order-section">
        <p><span className="order-label">Shipping To:</span><br />
          {order.full_name}<br />
          {order.phone}<br />
          {order.address}
        </p>
      </div>

      <div className="order-section">
        <p><span className="order-label">Order Notes:</span></p>
        <p>{order.note || 'No notes provided.'}</p>
      </div>

      <div className="order-section">
        <h3>Items Purchased</h3>
        {order.items && order.items.length > 0 ? (
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price?.toFixed(2)}</td>
                  <td>${item.subtotal?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items found for this order.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
