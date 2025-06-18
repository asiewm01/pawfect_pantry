import React, { useEffect, useState } from 'react';
import axios from '../../axiosSetup';
import { Link } from 'react-router-dom';
import './css/OrderHistory.css';
import DashboardSidebar from '../../components/Navigation/DashboardSidebar';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  // ✅ One-time refresh on first entry to this page
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('orderHistoryRefreshed');
    if (!hasRefreshed) {
      sessionStorage.setItem('orderHistoryRefreshed', 'true');
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/orders/`, {
        withCredentials: true
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Failed to fetch order history:', err);
      setError('Unable to load your order history.');
    }
  };

  return (
    <div className="nova-container container-fluid my-5 px-4">
      <div className="row flex-lg-nowrap">

        {/* Sidebar */}
        <div className="col-lg-3 col-md-12 mb-4">
          <DashboardSidebar />
        </div>

        {/* Main Content */}
        <div className="col-lg-9 col-md-12 history-container">
          <h2>🧾 Order History</h2>
          {error && <p className="text-danger">{error}</p>}

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Total ($)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>{order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>
                      <Link to={`/orders/detail/${order.id}`} className="view-btn">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Empty State */}
          {orders.length === 0 && !error && (
            <p className="text-muted mt-3">You haven't placed any orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
