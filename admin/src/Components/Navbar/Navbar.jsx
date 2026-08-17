import React, { useEffect, useState } from 'react';
import './Navbar.css';

import navLogoLight from '../../assets/nav-logo-light.png';
import navLogoDark from '../../assets/nav-logo-dark.png';
import navProfile from '../../assets/nav-profile.png';

const Navbar = () => {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(
      theme === "light" ? "dark" : "light"
    );
  };
  const logout = () => {

    localStorage.removeItem("admin-token");
    localStorage.removeItem("admin-name");

    window.location.href = "/login";

  };

  return (
    <div className="navbar">

      <div className="navbar-left">

        <img
          src={theme === "light" ? navLogoLight : navLogoDark}
          alt="Admin Logo"
          className="nav-logo"
        />

      </div>

      <div className="navbar-right">

        <button
          className="theme-btn"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>

        <div className="admin-profile">
        <img
            src={navProfile}
            alt="Profile"
            className="nav-profile"
        />
        <button
            className="logout-btn"
            onClick={logout}
        >
          Logout
        </button>
        </div>

      </div>

    </div>
  );
};

export default Navbar;