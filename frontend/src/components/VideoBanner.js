import React, { useEffect, useState } from 'react';
import './css/VideoBanner.css';
import { Link } from 'react-router-dom';

const slides = [
  {
    src: '/media/images/home_banner.gif',
    alt: 'Pet eating food',
    showOverlay: true
  },
  {
    src: '/media/images/home_banner.png',
    alt: 'Product promo banner',
    showOverlay: false
  }
];

const VideoBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // Change every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[current];

  return (
<div className="video-banner-container">
  <img
    src={currentSlide.src}
    alt={currentSlide.alt}
    className="video-banner"
  />

  {currentSlide.showOverlay && (
    <div className="video-overlay-text">
      <h1>Welcome to Pawfect Meals</h1>
      <p>Healthy food for happy pets 🐶🐱</p>
      <p>From premium kibble to freeze-dried delicacies, we deliver handpicked, nutritious options your pets will love.</p>
      <p>Whether you’ve got a playful pup, a finicky feline, or a curious exotic — we’ve got something pawfect for them all!</p>
      <Link to="/catalogue" className="btn btn-primary mt-3">
        Explore Products
      </Link>
    </div>
  )}
</div>
  );
};

export default VideoBanner;
