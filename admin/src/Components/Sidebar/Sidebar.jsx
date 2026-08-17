import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaPlusSquare, FaListAlt, FaShoppingBag } from "react-icons/fa";

import add_product_icon from "../../assets/Product_Cart.png";
import list_product_icon from "../../assets/Product_list_icon.png";
import coupon_icon from "../../assets/coupon_icon.png";
import Dashboard from "../../Components/Dashboard/Dashboard";
import Coupon from "../../Components/Coupon/Coupon";
const Sidebar = () => {
  return (
    <div className="sidebar">
       <Link to="/" className="sidebar-link">
        <div className="sidebar-item">
          <MdDashboard size={24} />
          <p>Dashboard</p>
        </div>
      </Link>
      <Link to="/addproduct" className="sidebar-link">
        <div className="sidebar-item">
          <img src={add_product_icon} alt="Add Product" />
          <p>Add Product</p>
        </div>
      </Link>

      <Link to="/listproduct" className="sidebar-link">
        <div className="sidebar-item">
          <img src={list_product_icon} alt="Product List" />
          <p>Product List</p>
        </div>
      </Link>
      <Link to="/orders" className="sidebar-link">
        <div className="sidebar-item">
        <img
            src={list_product_icon}
            alt=""
          />
        <p>Orders</p>
      </div>
      </Link>
       <Link to="/coupon" style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
           <img src={coupon_icon} alt="" />
            <p>Coupons</p>
          </div>
      </Link>
      </div>
  );
};

export default Sidebar;
