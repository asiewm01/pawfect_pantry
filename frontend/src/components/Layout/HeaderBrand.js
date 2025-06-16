import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/HeaderBrand.css';
import './css/ResponsiveHeaderBrand.css';

const HeaderBrand = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

const showFullCorgi = windowWidth >= 1280;
const showShortCorgi = windowWidth <= 1280 && windowWidth >= 853;
const showCorgiBanner = windowWidth >= 853;

  return (
    <div className="header-top">
      <div className="brand-area">
        <Link to="/">
          <img
            src="/media/images/logo.png"
            alt="Logo"
            className="site-logo"
          />
        </Link>

        <span className="brand-name">
          <p className="slogan-desktop d-none d-md-block">
            Where every bite is perfectly paw-picked.
          </p>
          <div className="slogan-mobile d-block d-md-none">
            <p>Where every bite is</p>
            <p>perfectly paw-picked.</p>
          </div>
        </span>
      </div>

      {showCorgiBanner && (
        <div className="corgi-banner">
          {showFullCorgi && (
            <img
              src="/media/images/corgi-speech.png"
              alt="Full Corgi"
              className="corgi-image full-corgi"
            />
          )}
          {showShortCorgi && (
            <img
              src="/media/images/corgi-speech-2.png"
              alt="Short Corgi"
              className="corgi-image short-corgi"
              style={{ display: 'block' }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderBrand;
