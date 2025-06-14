import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import './css/ProductDetail.css';
import FeedbackSection from '../../components/FeedbackSection';
import CartSuccessPopup from '../../components/Popup/CartSuccessPopup';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // ✅ Initial product load
  useEffect(() => {
    fetchProductData();
  }, [id]);

  // ✅ One-time reload to handle stale page load
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('productDetailRefreshed');
    if (!hasRefreshed) {
      sessionStorage.setItem('productDetailRefreshed', 'true');
      window.location.reload();
    }
  }, []);

  const fetchProductData = async () => {
    try {
      const res = await axios.get(`/api/catalogue/${id}/`);
      setProduct(res.data);
      setFeedbackList(res.data.feedback || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load product data');
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `/api/catalogue/${id}/feedback/submit/`,
        { comment },
        { withCredentials: true }
      );
      setComment('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchProductData();
    } catch (err) {
      console.error(err);
      setError('Error submitting feedback');
    }
  };

  const handleAddToCart = async (productId, redirectToCart = false) => {
    try {
      const response = await axios.post(
        `/api/cart/add/${productId}/`,
        { quantity },
        { withCredentials: true }
      );
      setPopupMessage(response.data.message || 'Item added to cart!');
      setShowPopup(true);
      if (redirectToCart) {
        setTimeout(() => navigate('/cart'), 1000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item. Please log in first.');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container-xl product-detail mt-4">
      <div className="row">
        <div className="col-md-6 text-center">
          <img
            src={product.image || '/static/images/placeholder.jpg'}
            alt={product.name}
            className="img-fluid product-img"
          />
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p>
            <strong>Species:</strong> {product.species || 'N/A'} <br />
            <strong>Food Type:</strong> {product.food_type || 'N/A'}
          </p>
          <p>{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p>
            <strong>Stock:</strong>{' '}
            {product.stock > 0 ? product.stock : (
              <span style={{ color: 'red' }}>Out of Stock</span>
            )}
          </p>

          {product.stock > 0 && (
            <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
              <div style={{ flex: '0 0 100px' }}>
                <label htmlFor="quantity"><strong>Qty:</strong></label>
                <input
                  type="number"
                  id="quantity"
                  className="form-control"
                  value={quantity}
                  min="1"
                  max={product.stock}
                  onChange={(e) =>
                    setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))
                  }
                />
              </div>
              <button
                className="btn btn-success btn-lg flex-grow-1"
                onClick={() => handleAddToCart(product.id)}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-primary btn-lg flex-grow-1"
                onClick={() => handleAddToCart(product.id, true)}
              >
                Go to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="feedback-form">
            <h4>Leave Feedback</h4>
            <form onSubmit={handleSubmitFeedback}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="form-control mb-2"
                placeholder="Write your comment"
                required
              />
              {success && <p className="text-success">Thank you for your feedback!</p>}
              {error && <p className="text-danger">{error}</p>}
              <button type="submit" className="btn btn-primary w-100">Submit Feedback</button>
            </form>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-12">
          <FeedbackSection feedbackList={feedbackList} />
        </div>
      </div>

      {showPopup && (
        <CartSuccessPopup
          message={popupMessage}
          onClose={() => {
            setShowPopup(false);
            fetchProductData();
          }}
        />
      )}
    </div>
  );
};

export default ProductDetail;
