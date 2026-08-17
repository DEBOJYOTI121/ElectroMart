import React from 'react';
import './NewsLetter.css';

const NewsLetter = () => {
  return (
    <div className='newsletter'>

      <h1>Get Exclusive Offers On Email</h1>

      <p>
        Subscribe to our newsletter and stay updated
      </p>

      <div className="newsletter-box">

        <input
          type="email"
          placeholder="Enter your email address"
        />

        <button>
          Subscribe
        </button>

      </div>

    </div>
  );
};

export default NewsLetter;