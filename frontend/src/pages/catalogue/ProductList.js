import React, { useState, useEffect, useCallback } from 'react';
import './css/ProductList.css';
import ProductFilterForm from '../../components/Product/ProductFilterForm';
import { Link } from 'react-router-dom';
import axios from '../../axiosSetup';
import { motion } from 'framer-motion';
import CartSuccessPopup from '../../components/Popup/CartSuccessPopup';

const ProductList = ({ products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [filters, setFilters] = useState({ search: '', sort: '', species: '', food_type: '' });
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    hasNext: false,
    hasPrev: false,
    totalPages: 1
  });

  const [recommended, setRecommended] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // ✅ AI Recommendations (once)
  useEffect(() => {
    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/ai/recommend/`, { withCredentials: true })
      .then(res => {
        setRecommended(res.data.recommended || []);
      })
      .catch(err => {
        console.error('Failed to fetch AI recommendations:', err);
      });
  }, []);

  // ✅ Fetch products with pagination + filters
  const fetchProducts = useCallback((page = 1, currentFilters = filters) => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page,
      search: currentFilters.search || '',
      sort: currentFilters.sort || '',
      species: currentFilters.species || '',
      food_type: currentFilters.food_type || ''
    });

    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/catalogue/?${queryParams.toString()}`)
      .then(res => {
        const productArray = res.data.products;
        if (Array.isArray(productArray)) {
          setProducts(productArray);
          setPageInfo({
            page: res.data.page,
            hasNext: res.data.has_next,
            hasPrev: res.data.has_previous,
            totalPages: res.data.total_pages
          });
        } else {
          setProducts([]);
          console.warn('Expected "products" array, got:', res.data);
        }
      })
      .catch(err => {
        console.error('Product fetch error:', err);
        setError('Failed to load products.');
      })
      .finally(() => setLoading(false));
  }, [filters]);

  // ✅ Fetch products when filters or page change
useEffect(() => {
  fetchProducts(pageInfo.page, filters);
}, [fetchProducts, pageInfo.page]); // ✅ now compliant with ESLint

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(
        `https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/cart/add/${productId}/`,
        {},
        { withCredentials: true }
      );
      setPopupMessage(response.data.message || 'Item added to cart!');
      setShowPopup(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item. Please log in first.');
    }
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage, filters);
    setPageInfo(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="product-list-container">
<motion.div
  className="container-fluid p-0"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  <div className="row align-items-center justify-content-between gx-3 px-3">

    {/* Left-side image */}
    <div className="col-auto d-none d-xl-block">
      <img
        src="/media/images/cat-dog-food-left.png"
        alt="Left Pets"
        className="side-animal-img"
      />
    </div>

    {/* Center content: Title + Filter */}
    <div className="col text-center">
      <div className="filter-header-group mb-3">
<h1 className="homepage-title d-inline-flex align-items-center justify-content-center">
  Welcome to Our Pet Food & Merchandise Store
  <img
    src="/media/images/ferret.png"
    alt="kawaii Cat"
    className="kawaii-cat ms-2 d-none d-xl-inline-block"
    style={{
      height: '70px',
      marginLeft: '10px'
    }}
  />
</h1>

<p className="homepage-subtext mt-2">
  Explore nutritious meals and playful goodies tailored for your furry friends—because they deserve the best!
</p>
      </div>

      <div className="filter-bar d-flex flex-wrap justify-content-center gap-2">
        <ProductFilterForm onFilter={setFilters} />
      </div>
    </div>

    {/* Right-side image */}
    <div className="col-auto d-none d-xl-block">
      <img
        src="/media/images/cat-dog-food-right.png"
        alt="Right Pets"
        className="side-animal-img"
      />
    </div>

  </div>
</motion.div>

      <hr className="solid my-4" />

      {loading && <p className="text-center">Loading products...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <img
                src={product.image || '/media/images/placeholder.png'}
                alt={product.name}
                className="product-img"
              />
              <h3>{product.name}</h3>
              <p>{product.description?.slice(0, 100)}...</p>
              <div className="price">${product.price}</div>
              <div className="category">{product.species} | {product.food_type}</div>
              <p className="views">{product.views} views</p>
              <div className="button-wrapper">
                <Link to={`/catalogue/${product.id}`} className="view-link">View Details</Link>
                <button className="add-btn" onClick={() => handleAddToCart(product.id)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : !loading ? (
          <p className="text-center">No products match your criteria.</p>
        ) : null}
      </div>

      <div className="pagination-controls">
        {pageInfo.hasPrev && (
          <button onClick={() => handlePageChange(pageInfo.page - 1)} className="btn btn-outline-primary me-2">
            &laquo; Previous
          </button>
        )}
        <span>Page {pageInfo.page} of {pageInfo.totalPages}</span>
        {pageInfo.hasNext && (
          <button onClick={() => handlePageChange(pageInfo.page + 1)} className="btn btn-outline-primary ms-2">
            Next &raquo;
          </button>
        )}
      </div>

      <hr className="solid my-4" />

      <motion.div className="ai-recommendation-section container py-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
<h2 className="recommendation-header text-center mb-3">
  <img src="/media/images/cat-sleep.png" alt="Cat" className="neko-img" />
  <span className="header-text">Recommended for You</span>
  <img src="/media/images/corgi-sleep.png" alt="Corgi" className="corgi-img" />
</h2>

        <div className="row justify-content-center">
          {recommended.length > 0 ? (
            recommended.map(product => (
              <div key={product.id} className="col-sm-12 col-md-6 col-lg-4 mb-4">
                <motion.div className="card h-100 shadow-sm" whileHover={{ scale: 1.02 }}>
                  <img
                    src={product.image || "/media/images/placeholder.jpg"}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "/media/images/placeholder.jpg"; }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text mb-1"><strong>Price:</strong> ${product.price}</p>
                    <p className="card-text"><strong>Views:</strong> {product.views}</p>
                    <a href={`/catalogue/${product.id}`} className="btn btn-outline-primary mt-auto">View Product</a>
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p className="text-muted">No personalized recommendations available yet.</p>
            </div>
          )}
        </div>
      </motion.div>

      {showPopup && (
        <CartSuccessPopup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default ProductList;
