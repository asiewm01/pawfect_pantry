import React, { useState, useEffect, useCallback } from 'react';
import './css/ProductList.css';
import ProductFilterForm from '../../components/ProductFilterForm';
import { Link } from 'react-router-dom';
import axios from '../../axiosSetup';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/ai/recommend/`, { withCredentials: true })
      .then(res => {
        setRecommended(res.data.recommended || []);
      })
      .catch(err => {
        console.error('Failed to fetch AI recommendations:', err);
      });
  }, []);

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

  useEffect(() => {
    if (!initialProducts) {
      fetchProducts(1, filters);
    }
  }, [initialProducts, fetchProducts, filters]);

  useEffect(() => {
    fetchProducts(1, filters);
  }, [filters, fetchProducts]);

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/cart/add/${productId}/`, {}, {
        withCredentials: true
      });
      alert(response.data.message || 'Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item. Please log in first.');
    }
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage, filters);
  };

  return (

    <div className="product-list-container">
          <div className="container-fluid p-0">
      <div className="row">
        <div className="col-12 text-center mt-3">
          <h1 className="homepage-title"><img src="/media/images/kawaii_cat.png" alt="Kawaii Cat" className="kawaii_cat" />Welcome to our pet food selection</h1>
        </div>
      </div>
    </div>
      <ProductFilterForm onFilter={setFilters} />

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
              <Link to={`/catalogue/${product.id}`} className="view-link">View Details</Link>
              <button className="add-btn" onClick={() => handleAddToCart(product.id)}>
                Add to Cart
              </button>
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
  <h2 className="text-center mb-4">Recommended for You<img src="/media/images/neko.png" alt="Neko" className="neko" /></h2>
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
    </div>
  );
};

export default ProductList;
