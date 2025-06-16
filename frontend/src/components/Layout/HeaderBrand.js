import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './css/HeaderBrand.css';

const HeaderBrand = () => {
  const [showCorgi, setShowCorgi] = useState(window.innerWidth > 830);

  useEffect(() => {
    const handleResize = () => {
      console.log("Window width:", window.innerWidth); // ✅ debug
      setShowCorgi(window.innerWidth > 820);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
<p className="slogan-desktop">
  Where every bite is perfectly paw-picked.
</p>

{/* Mobile/iPad slogan */}
<div className="slogan-mobile">
  <p>Where every bite is</p>
  <p>perfectly paw-picked.</p>
</div>
        </span>
      </div>

      {/* 🐾 CORGI ONLY ABOVE 820px */}
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
              src="/media/images/corgi-speech.png"
              alt="Corgi Speech"
              className="corgi-speech"
              style={{
                height: '200px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 10px 0 0',
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
