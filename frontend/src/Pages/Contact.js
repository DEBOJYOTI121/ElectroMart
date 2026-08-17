import React from 'react';
import './CSS/Contact.css';

const Contact = () => {
  return (
    <div className="contact">

      <div className="contact-header">
        <h1>Contact Us</h1>

        <p>
          We'd love to hear from you. Reach out for support,
          feedback, or any questions.
        </p>
      </div>

      <div className="contact-container">

        <div className="contact-info">

          <div className="info-box">
            <h3>Email</h3>
            <p>mitradebojyoti5@gmail.com</p>
          </div>

          <div className="info-box">
            <h3>Phone</h3>
            <p>+91 7602033395</p>
          </div>

          <div className="info-box">
            <h3>Address</h3>
            <p>West Bengal,South 24 Pgs,Mathurapur,743354</p>
          </div>

        </div>

        <form className="contact-form">

          <input type="text" placeholder="Your Name" required />

          <input type="email" placeholder="Your Email" required />

          <textarea
            rows="6"
            placeholder="Your Message"
            required
          ></textarea>

          <button type="submit">
            Send Message
          </button>

        </form>

      </div>
    </div>
  );
};

export default Contact;