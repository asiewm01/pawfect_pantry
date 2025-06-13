import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import './css/ProductDetail.css';
import FeedbackSection from '../../components/FeedbackSection';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.iocontainerapps.io/api/catalogue/${id}/`);
        setProduct(res.data);
        setFeedbackList(res.data.feedback || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load product data');
      }
    }
    fetchData();
  }, [id]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.iocontainerapps.io/api/catalogue/${id}/feedback/submit/`,
        { comment },
        { withCredentials: true }
      );
      setComment('');
      setSuccess(true);
      setError('');

      const updated = await axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.iocontainerapps.io/api/catalogue/${id}/`);
      setFeedbackList(updated.data.feedback || []);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error submitting feedback');
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        `https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.iocontainerapps.io/api/cart/add/${productId}/`,
        { quantity },
        { withCredentials: true }
      );
      alert(response.data.message || 'Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item. Please log in first.');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container-xl product-detail mt-4">
      {/* Product Info */}
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

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="d-flex align-items-end gap-2 mb-3">
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
                onClick={() => {
                  handleAddToCart(product.id);
                  navigate('/cart');
                }}
              >
                Go to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Form */}
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

      {/* Customer Feedback */}
      <div className="row mt-5">
        <div className="col-md-12">
          <FeedbackSection feedbackList={feedbackList} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
