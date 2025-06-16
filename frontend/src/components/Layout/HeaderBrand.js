import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/HeaderBrand.css';

const HeaderBrand = () => {
  const [showCorgi, setShowCorgi] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setShowCorgi(window.innerWidth < 1024);
    };

    checkScreenSize(); // Initial check
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

        <span
          className="brand-name"
          style={{
            color: '#2d7b3e',
            textShadow: '1px 1px 2px rgba(0,0,0,0.25)',
          }}
        >
          {/* Desktop slogan */}
          <p className="slogan-desktop d-none d-md-block">
            Where every bite is perfectly paw-picked.
          </p>

          {/* Mobile/iPad slogan */}
          <div className="slogan-mobile d-block d-md-none">
            <p>Where every bite is</p>
            <p>perfectly paw-picked.</p>
          </div>
        </span>
      </div>

      {/* 🐾 Show Corgi only if screen is above 830px */}
      {showCorgi && (
        <div
          className="corgi-wrapper"
          style={{
            position: 'absolute',
            right: 0,
            bottom: '-1px',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 5,
          }}
        >
          <div
            className="corgi-container"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <img
              src="/media/images/corgi-header.gif"
              alt="Corgi Speech"
              className="corgi-speech"
              style={{
                height: '190px',
                objectFit: 'contain',
                display: 'block',
                margin: 0,
                borderLeft: '4px solid black',
                padding: 0,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderBrand;
