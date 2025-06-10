import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useLocation } from 'react-router-dom';
import './css/SearchResult.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery().get('q') || '';
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/products/?q=${query}`)
      .then(res => setResults(res.data))
      .catch(err => console.error('Search error', err));
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Search Results for: <em>{query}</em></h2>
      <div className="row">
        {results.length > 0 ? results.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={product.image} className="card-img-top" alt={product.name} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
              </div>
            </div>
          </div>
        )) : <p>No results found.</p>}
      </div>
    </div>
  );
};

export default SearchResults;
