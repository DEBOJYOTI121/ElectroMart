import React from 'react';
import './HomePage.css';
import heroCable from '../Assets/hero-cable.png';
import wireIcon from '../Assets/wire-icon.png';
const HomePage = () => {
  return (
    <div className="homepage">
      {/* LEFT */}
      <div className="homepage-left">
        <p className="small-title">
          POWER • QUALITY • TRUST
        </p>
        <h1>
          Premium <span>Wires</span> &
          <br />
          Electrical
          <br />
          Solutions
        </h1>
        <p className="description">
          Discover high quality house wiring,
          industrial cables, switches, accessories
          and electrical products for every project.
        </p>
        <div className="homepage-buttons">
          <button className="shop-btn">
            Shop Now →
          </button>
          <button className="catalog-btn">
            View Products
          </button>
        </div>
        <div className="features">
          <div className="feature-box">
            <p>100% Copper</p>
          </div>
          <div className="feature-box">
            <p>Fire Resistant</p>
          </div>
          <div className="feature-box">
            <p>ISI Certified</p>
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="homepage-right">
        <div className="offer-card">
          <h3>20% OFF</h3>
          <p>On Premium Cables</p>
        </div>
        <img
          src={heroCable}
          alt=""
          className="hero-image"
        />
        <img
          src={wireIcon}
          alt=""
          className="floating-image"
        />
      </div>
    </div>
  );
};
export default HomePage;