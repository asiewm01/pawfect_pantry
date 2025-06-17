import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './css/homepage/HomePage.css';
import './css/homepage/ResponsiveHomePage.css';
import ProductFilterForm from '../components/Product/ProductFilterForm';
import VideoBanner from '../components/VideoBanner';
import ExoticImageSlider from '../components/ExoticImageSlider';

const HomePage = () => {
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const hasRedirected = sessionStorage.getItem('hasRedirected');

    axios.get(`https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io/api/ai/recommend/`, {
      withCredentials: true
    })
      .then(res => {
        setRecommended(res.data.recommended || []);
      })
      .catch(err => {
        console.error('Auth check failed:', err);

        if (!hasRedirected) {
          sessionStorage.setItem('hasRedirected', 'true');
          navigate('/login');
        }
      });
  }, []);

  const handleFilter = (filters) => {
    const queryParams = new URLSearchParams();
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.species) queryParams.append('species', filters.species);
    if (filters.food_type) queryParams.append('food_type', filters.food_type);
    navigate(`/catalogue?${queryParams.toString()}`);
  };

  return (
    <>
<motion.div className="container-fluid p-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
  <div className="row align-items-center justify-content-between gx-3 px-3">

    {/* Left-side image */}
    <div className="col-auto d-none d-xl-block">
      <img
        src="/media/images/cat-dog-left.png"
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
  src="/media/images/cute-cat.png"
  alt="Cute Cat"
  className="cute-cat ms-2 d-none d-xl-inline-block"
  style={{
    height: '70px',
    marginLeft: '10px'
  }}
/>
</h1>
      </div>

      <div className="filter-bar d-flex flex-wrap justify-content-center gap-2">
        <ProductFilterForm onFilter={handleFilter} />
      </div>
    </div>

    {/* Right-side image */}
    <div className="col-auto d-none d-xl-block">
      <img
        src="/media/images/cat-dog-right.png"
        alt="Right Pets"
        className="side-animal-img"
      />
    </div>

  </div>
</motion.div>


      <hr className="solid my-4" />
        <motion.div className="video-banner-wrapper d-none d-lg-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <VideoBanner />
      </motion.div>

<hr className="solid my-4 hr-hide-on-mobile" />


<motion.div
  className="container home-container"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  <div className="row d-flex flex-column flex-xxl-row align-items-stretch">
    
    {/* Image Section - First on small, second on large */}
    <div className="col-12 col-xxl-6 d-flex order-1 order-xxl-2 p-0">
      <div className="w-100 h-100">
<img
  src="/media/images/home_images.png"
  alt="Cats and Dogs"
  className="img-fluid w-100 rounded shadow"
  style={{ objectFit: 'cover', height: '100%', maxHeight: '500px' }}
/>

      </div>
    </div>

    {/* Text Section - Second on small, first on large */}
    <div className="col-12 col-xxl-6 d-flex order-2 order-xxl-1 mt-4 mt-xxl-0">
      <div className="card shadow-sm w-100 h-100 p-4">
<div className="d-flex justify-content-center">
  <h2 className="homepage-subtitle d-flex align-items-center gap-2">
    <img
      src="/media/images/corgi_butt.png"
      alt="Corgi Butt"
      className="corgi-butt"
      style={{ height: '70px' }}
    />
    “Tail-Wagging Goodness in Every Treat!”
  </h2>
</div>
        <hr className="solid divider-line" />
        <div className="about-text">
          <p>
            We provide the freshest, highest-quality pet food and thoughtfully curated merchandise to meet your companions' daily needs. From nutrition to playtime, enrichment to grooming, your pets deserve nothing less than excellence — and we deliver it with care, precision, and love.
          </p>
          <p>
            All our products are sustainably sourced from trusted suppliers across the globe. We work only with partners who share our commitment to quality, safety, and ethical practices, ensuring every bite and toy meets rigorous standards without compromise.
          </p>
          <p>
            Whether you're looking for grain-free kibble, freeze-dried treats, interactive toys, or eco-friendly accessories — we've got it all. Whatever your furry, scaly, or feathered friend needs, PawFect Pantry is here to keep tails wagging, feathers fluffed, and whiskers happy!
          </p>
        </div>
      </div>
    </div>

  </div>
</motion.div>



      <hr className="solid my-4" />

<motion.div className="container home-container exotic-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
  <div className="row align-items-stretch stack-on-1280 d-flex flex-md-row">
          <div className="col-md-6 d-flex p-0">
            <div className="w-100 h-100 exotic-slider-wrapper">
              <ExoticImageSlider />
            </div>
          </div>
          <div className="col-md-6 d-flex">
            <div className="welcome-card w-100">
              <h2 className="homepage-subtitle">
                <img src="/media/images/hedgehog.png" alt="Hedgehog" className="hedgehog" /> Treat your pets to something paw-some!
              </h2>
              <hr className="solid divider-line" />
              <div className="full-paragraphs">
                <p>
                  Join our pet-loving community and get the inside scoop on nutritious treats, trending toys, and seasonal must-haves for your furry best friends. Whether you're raising a playful kitten, an energetic pup, or a wise senior companion, we’ve got curated picks just for them.
                </p>
                <p>
                  Every week, we deliver expert care tips, product highlights, and special offers tailored to your pet’s breed, age, and lifestyle. From grain-free meals to chew-proof accessories, we spotlight only the best — tested and loved by real pet parents like you.
                </p>
                <p>
                  Subscribe today and be the first to unlock exclusive deals, surprise giveaways, and early access to new arrivals. Because your pet deserves more than ordinary — they deserve PawFect!
                </p>
              </div>
              <hr className="solid divider-line hide-on-1024" />
              <div className="about-text">
                <h4 className="mb-3">Stay updated on our exotic pet food & offers 🐾</h4>
                <form className="d-flex flex-column flex-md-row gap-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Subscribe
                  </button>
                </form>
                <p className="mt-3 text-muted" style={{ fontSize: "0.9rem" }}>
                  Subscribe to receive updates, promotions, and pet care tips — tailored for your exotic companion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <hr className="solid my-4" />

      <motion.div className="container my-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }}>
        <h2 className="mb-4 text-center">
          Our Recommendations
          <img src="/media/images/corgi-over-navbar.png" alt="Corgi" className="corgi-over-navbar" />
        </h2>
        <div className="row">
          {recommended.length > 0 ? (
            recommended.map(product => (
              <div key={product.id} className="col-md-4 mb-4">
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
                    <a href={`/catalogue/${product.id}`} className="btn btn-primary mt-auto">View Details</a>
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p>Loading recommendations or none found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default HomePage;
