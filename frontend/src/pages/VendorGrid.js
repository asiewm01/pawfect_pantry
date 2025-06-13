import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/VendorGrid.css';

const VendorGrid = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL || 'https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io'}/api/vendors/`)
      .then(res => setVendors(res.data))
      .catch(err => console.error('Failed to fetch vendors', err));
  }, []);

  // 🧠 Map vendor name to image filename
  const getVendorImageUrl = (vendorName) => {
    const nameMap = {
      "Hill's Pet Nutrition": "HillPet",
      "Grandma Lucy's": "GrandmaLucy",
      "PetCube Co": "PetCubes",
      "North Coast Co": "NorthCoast",
      "PaleoFood Co": "PaleoFood",
      "Insectta Co": "Insectta",
      "Green Prairie": "GreenPrairie"
    };

    const filename = nameMap[vendorName] || vendorName.replace(/\s+/g, '');
    return `https://pawfectmediastore.blob.core.windows.net/media/brand_images/${filename}.png`;
  };

  return (
    <div className="vendor-container">
      <div className="vendor-banner">
        <div className="vendor-banner-overlay">
          <h2>Meet the premium vendors who power our pet ecosystem.</h2>
          <p>
            Each of our partners has been carefully selected for their unwavering commitment to quality, sustainability, and innovation in pet care.
            From biotech pioneers creating alternative protein sources to trusted global nutrition brands backed by veterinary science, these vendors represent the cutting edge of pet wellness.
            Together, they provide a diverse range of products — from holistic foods and functional treats to responsibly sourced ingredients — that support happier, healthier lives for pets of all breeds, ages, and dietary needs.
            When you shop with us, you’re not just choosing products — you’re choosing a curated network of trusted industry leaders dedicated to your pet’s well-being.
          </p>
        </div>
      </div>

      <hr className="solid my-4" />

      <div className="row">
        {vendors.map((vendor) => (
          <div className="col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 mb-4" key={vendor.id}>
            <div className="vendor-card">
              <div className="vendor-image">
                <img
                  src={getVendorImageUrl(vendor.name)}
                  alt={`Logo of ${vendor.name}`}
                  onError={(e) => {
                    e.target.src = "https://pawfectmediastore.blob.core.windows.net/media/default_vendor.png";
                  }}
                />
              </div>
              <div className="vendor-info">
                <h4>{vendor.name}</h4>
                <p>{vendor.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorGrid;
