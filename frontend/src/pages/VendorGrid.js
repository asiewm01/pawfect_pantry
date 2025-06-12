import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/VendorGrid.css'; // Custom styles

const VendorGrid = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    axios.get('https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/vendors/') // 🔁 Adjust API path as needed
      .then(res => setVendors(res.data))
      .catch(err => console.error('Failed to fetch vendors', err));
  }, []);

  return (
    <div className="vendor-container">
      <h2>🐾 Our Trusted Vendors</h2>
      <div className="vendor-grid">
        {vendors.map((vendor, index) => (
          <div className="vendor-card" key={vendor.id}>
            <div className="vendor-image">
              <img src={vendor.image} alt={vendor.name} />
            </div>
            <div className="vendor-info">
              <h4>{vendor.name}</h4>
              <p>{vendor.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorGrid;
