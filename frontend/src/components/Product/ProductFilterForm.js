import React, { useState, useEffect } from 'react';
import './css/ProductFilterForm.css';
import axios from '../../axiosSetup';

const ProductFilterForm = ({ onFilter }) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [species, setSpecies] = useState('');
  const [foodType, setFoodType] = useState('');

  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [foodTypeOptions, setFoodTypeOptions] = useState([]);

  useEffect(() => {
    // Fetch distinct species from backend
    axios.get('https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/species-categories/')
      .then(res => setSpeciesOptions(res.data))
      .catch(err => console.warn('Failed to fetch species:', err));

    // Fetch distinct food types from backend
    axios.get('https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/food-type-categories/')
      .then(res => setFoodTypeOptions(res.data))
      .catch(err => console.warn('Failed to fetch food types:', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      search,
      sort,
      species,
      food_type: foodType
    });
  };

  return (
    <form className="product-filter-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort By</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="az">A–Z</option>
        <option value="za">Z–A</option>
      </select>

      <select value={species} onChange={(e) => setSpecies(e.target.value)}>
        <option value="">All Species</option>
        {speciesOptions.map((opt, index) => (
          <option key={index} value={opt}>{opt}</option>
        ))}
      </select>

      <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
        <option value="">All Food Types</option>
        {foodTypeOptions.map((opt, index) => (
          <option key={index} value={opt}>{opt}</option>
        ))}
      </select>

      <button type="submit">Apply</button>
    </form>
  );
};

export default ProductFilterForm;
