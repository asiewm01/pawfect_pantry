import React, { useState, useEffect } from 'react';
import './css/ExoticImageSlider.css';

const exoticSlides = [
  {
    src: '/media/images/exotic_images.png',
    alt: 'French Bulldog',
    isDog: true
  },
  {
    src: '/media/images/cat-promotion.gif',
    alt: 'Cat promotion',
    isDog: false
  }
];

const ExoticImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % exoticSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = exoticSlides[current];
  const bgClass = slide.isDog ? 'show-dog-bg' : 'show-cat-bg';

  return (
    <div className="exotic-slide-box">
      <div className={`exotic-two-tone-bg ${bgClass}`}>
        <img
          src={slide.src}
          alt={slide.alt}
          className="exotic-slide-img"
        />
      </div>
    </div>
  );
};

export default ExoticImageSlider;
