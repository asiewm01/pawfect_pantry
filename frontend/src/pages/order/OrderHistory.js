import React, { useEffect, useState } from 'react';
import axios from '../../axiosSetup';
import { Link } from 'react-router-dom';
import './css/OrderHistory.css';
import DashboardSidebar from '../../components/Navigation/DashboardSidebar';

const ORDERS_PER_PAGE = 10;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  return (
    <div className="nova-container container-fluid my-5 px-4">
      <div className="row flex-lg-nowrap">
        <div className="col-lg-3 col-md-12 mb-4">
          <DashboardSidebar />
        </div>

        <div className="col-lg-9 col-md-12 history-container">
          <h2>🧾 Order History</h2>
          {error && <p className="text-danger">{error}</p>}

          <div className="table-responsive">
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
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{(currentPage - 1) * ORDERS_PER_PAGE + index + 1}</td>
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
          </div>

          {/* Scrollable Pagination */}
          {orders.length > ORDERS_PER_PAGE && (
            <div className="pagination-wrapper mt-3">
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {orders.length === 0 && !error && (
            <p className="text-muted mt-3">You haven't placed any orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
