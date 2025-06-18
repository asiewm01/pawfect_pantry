import React from 'react';
import { motion } from 'framer-motion';

const RecommendedProductCard = ({ product }) => {
  return (
    <div className="col-md-4 mb-4">
      <motion.div className="card shadow-sm h-100" whileHover={{ scale: 1.03 }}>
        <img
          src={product.image || "/media/images/placeholder.jpg"}
          className="card-img-top"
          alt={product.name}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/media/images/placeholder.jpg";
          }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text text-success"><strong>${product.price}</strong></p>
          <p className="card-text"><strong>Views:</strong> {product.views}</p>
          <a href={`/catalogue/${product.id}`} className="btn btn-primary mt-auto">
            View Details
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default RecommendedProductCard;

