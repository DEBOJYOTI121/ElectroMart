import React from 'react';
import './Footer.css';

import footer_logo from '../Assets/logo_big.png';

import linkedin_icon from '../Assets/linkedin_icon.png';
import facebook_icon from '../Assets/facebook_icon.png';
import instagram_icon from '../Assets/instagram_icon.png';
import github_icon from '../Assets/github_icon.png';

const Footer = () => {
  return (
    <div className='footer'>

      {/* Logo */}
      <div className='footer-logo'>
        <img src={footer_logo} alt="logo" />
        <p>ELECTRO MART</p>
      </div>

      {/* Links */}
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      {/* Social Icons */}
      <div className="footer-social-icon">

        <a
          href="https://www.linkedin.com/in/debojyoti-mitra-167a0834b/"
          target="_blank"
          rel="noreferrer"
          className="footer-icons-container"
        >
          <img src={linkedin_icon} alt="LinkedIn" />
        </a>
        <a
          href="https://www.facebook.com/debojyoti.mitra.585"
          target="_blank"
          rel="noreferrer"
          className="footer-icons-container"
        >
          <img src={facebook_icon} alt="Facebook" />
        </a>
        <a
          href="https://www.instagram.com/debojyoti.mitra.585/"
          target="_blank"
          rel="noreferrer"
          className="footer-icons-container"
        >
          <img src={instagram_icon} alt="Instagram" />
        </a>
        <a
          href="https://github.com/DEBOJYOTI121"
          target="_blank"
          rel="noreferrer"
          className="footer-icons-container"
        >
          <img src={github_icon} alt="GitHub" />
        </a>
      </div>
      {/* Copyright */}
      <div className="footer-copyright">
        <hr />
        <p>Copyright © 2026 - All Rights Reserved</p>
      </div>

    </div>
  );
};
export default Footer;