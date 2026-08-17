import React from 'react';
import './Offer.css';
import exclusive_image from '../Assets/exclusive_img.png';
const Offer = () => {
  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>PREMIUM ELECTRICAL COMPONENTS AT EXCLUSIVE PRICES</p>
        <button>Shop Now</button>
      </div>
      <div className="offers-right">
        <img src={exclusive_image} alt=""/>
      </div>
    </div>
  );
};
export default Offer;
