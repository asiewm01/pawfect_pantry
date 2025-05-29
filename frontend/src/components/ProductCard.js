import React from 'react';
import './css/ProductCard.css';

const ProductCard = () => {
  const product = {
    image: "https://pawfectmediastore.blob.core.windows.net/media/product-1.png",
    name: "Sample Product"
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} width="200" />
      <h3>{product.name}</h3>
    </div>
  );
};

export default ProductCard;
