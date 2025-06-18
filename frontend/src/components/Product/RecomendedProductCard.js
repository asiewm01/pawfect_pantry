import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './css/RecommendProductCard.css';

const RecommendedProductCard = ({ product, onAddToCart }) => {
  return (
    <motion.div className="product-card" whileHover={{ scale: 1.03 }}>
      <img
        src={product.image || '/media/images/placeholder.png'}
        alt={product.name}
        className="product-img"
        onError={(e) => { e.target.onerror = null; e.target.src = '/media/images/placeholder.png'; }}
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="description">{product.description?.slice(0, 100)}...</p>
      <div className="price">${product.price}</div>
      <div className="category">{product.species} | {product.food_type}</div>
      <div className="button-wrapper">
        <Link to={`/catalogue/${product.id}`} className="view-link">View</Link>
        <button className="add-btn" onClick={() => onAddToCart(product.id)}>Add</button>
      </div>
    </motion.div>
  );
};

export default RecommendedProductCard;
