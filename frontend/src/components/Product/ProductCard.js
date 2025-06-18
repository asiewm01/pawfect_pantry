import React from 'react';
import './css/ProductCard.css';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
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
        <button className="add-btn" onClick={() => onAddToCart(product.id)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
