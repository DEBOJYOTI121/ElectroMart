import React, { useState, useContext } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FaCartPlus } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { FaHeart } from "react-icons/fa";
const Navbar = ({ darkMode, setDarkMode }) => {

  const [menu, setMenu] = useState("home");
  const [showProfile, setShowProfile] = useState(false);
  const { getTotalCartItems, setCartItems } = useContext(ShopContext);
  const token = localStorage.getItem("auth-token");
  const userName = localStorage.getItem("user-name");
  const userEmail = localStorage.getItem("user-email");
  const {wishlistItems} = useContext(ShopContext);
  const profileLetter =
    userName?.charAt(0).toUpperCase() ||
    userEmail?.charAt(0).toUpperCase() ||
    "U";

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {

  localStorage.removeItem("auth-token");
  localStorage.removeItem("user-name");
  localStorage.removeItem("user-email");
  localStorage.removeItem("user-mobile");

  try {
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }

  window.location.href = "/";
  setCartItems({});
};

  return (
    <div className={`navbar ${darkMode ? "dark" : ""}`}>

      {/* LEFT */}
      <Link
        to="/"
        className="nav-logo"
        style={{ textDecoration: "none" }}
      >
        <img src={logo} alt="logo" />
        <p>ELECTRO MART</p>
      </Link>

      {/* CENTER */}
      <ul className="nav-menu">

        <li className='theme-btn' onClick={toggleTheme}>
          {darkMode ? <FaEyeSlash /> : <FaEye />}
        </li>

        <li onClick={() => setMenu("home")}>
          <Link to="/">Home</Link>
          {menu === "home" && <hr />}
        </li>

        <li onClick={() => setMenu("wire")}>
          <Link to="/wire">Wires & Cables</Link>
          {menu === "wire" && <hr />}
        </li>

        <li onClick={() => setMenu("switches")}>
          <Link to="/switches">Switches & Sockets</Link>
          {menu === "switches" && <hr />}
        </li>

        <li onClick={() => setMenu("circuitbreaker")}>
          <Link to="/circuitbreaker">
            Circuit Breaker & Main Switch
          </Link>
          {menu === "circuitbreaker" && <hr />}
        </li>

        <li onClick={() => setMenu("about")}>
          <Link to="/about">About</Link>
          {menu === "about" && <hr />}
        </li>

        <li onClick={() => setMenu("contact")}>
          <Link to="/contact">Contact</Link>
          {menu === "contact" && <hr />}
        </li>
        {token && (
            <li onClick={() => setMenu("myorders")}>
              <Link to="/myorders">My Orders</Link>
              {menu === "myorders" && <hr />}
            </li>
          )}
      </ul>

      {/* RIGHT */}
      <div className="nav-login-cart">

        {token ? (

          <div className="profile-section">

            <div
              className="profile-avatar"
              onClick={() => setShowProfile(!showProfile)}
            >
              {profileLetter}
            </div>

            {showProfile && (
              <div className="profile-dropdown">

                <p>{userName || "User"}</p>

                <small>{userEmail}</small>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                 >
                  Logout
                </button>

              </div>
            )}

          </div>

        ) : (

          <Link to="/login">
            <button className="login-btn">
              Login
            </button>
          </Link>

        )}
        <div className="wishlist-icon">
        <Link to="/wishlist">
            <FaHeart />
        </Link>
        {wishlistItems.length > 0 && (
            <div className="wishlist-count">
                {wishlistItems.length}
            </div>
        )}
      </div>
        <div className="cart-container">
          <Link to="/cart">
            <FaCartPlus className="cart-icon" />
          </Link>

          <span className="cart-count">
            {getTotalCartItems()}
          </span>

        </div>

      </div>

    </div>
  );
};

export default Navbar;