import React from 'react';
import './CSS/About.css';

const About = () => {
  return (
    <div className="about">

      <div className="about-hero">
        <h1>About Us</h1>
        <p>
          Welcome to ShopSphere — your trusted destination for fashion,
          lifestyle, and modern shopping experiences.
        </p>
      </div>

      <div className="about-container">

        <div className="about-card">
          <h2>Who We Are</h2>

          <p>
            We are passionate about creating a smooth and enjoyable online
            shopping experience for everyone. Our goal is to provide
            high-quality products with modern design and affordable pricing.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Mission</h2>

          <p>
            Our mission is to combine technology and fashion to build
            an e-commerce platform that is simple, fast, and user-friendly.
          </p>
        </div>

        <div className="about-card">
          <h2>Why Choose Us?</h2>

          <ul>
            <li>✔ Premium Quality Products</li>
            <li>✔ Secure Shopping Experience</li>
            <li>✔ Fast Delivery</li>
            <li>✔ Responsive Customer Support</li>
            <li>✔ Modern & Easy-to-Use Interface</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
export default About;