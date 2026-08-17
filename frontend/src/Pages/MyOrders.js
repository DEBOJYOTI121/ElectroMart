import React, { useEffect, useState } from "react";
import generateInvoice from "../Pages/Utils/InvoiceGenerator";
import "./CSS/MyOrders.css";
import { API_URL } from "../config";
import {
    FaClipboardCheck,
    FaCheckCircle,
    FaBoxOpen,
    FaTruck,
    FaMotorcycle,
    FaHome
} from "react-icons/fa";
const MyOrders = () => {
const [orders, setOrders] = useState([]);
useEffect(() => {
    const fetchOrders = () => {
        fetch(`${API_URL}/myorders`, {
            method:"GET",
            headers:{
                Accept:"application/json",
                "auth-token":localStorage.getItem("auth-token")
            }
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.success){
                setOrders(data.orders);
            }
        });
    };
    fetchOrders();
    const interval = setInterval(fetchOrders,15000);
    return ()=>clearInterval(interval);
},[]);
  const orderSteps = [
    {
        title: "Pending",
        icon: <FaClipboardCheck />
    },
    {
        title: "Approved",
        icon: <FaCheckCircle />
    },
    {
        title: "Packed",
        icon: <FaBoxOpen />
    },
    {
        title: "Shipped",
        icon: <FaTruck />
    },
    {
        title: "Out For Delivery",
        icon: <FaMotorcycle />
    },
    {
        title: "Delivered",
        icon: <FaHome />
    }
];
const getStepIndex = (status) => {
    return orderSteps.findIndex(
        step => step.title === status
    );
};
const getEstimatedDelivery = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString(
        "en-IN",
        {
            day:"numeric",
            month:"long",
            year:"numeric"
        }
    );
};
  return (
    <div className="myorders">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <h2>No Orders Yet</h2>
      ) : (
        orders.map((order) => (
          <div
            className="myorder-card"
            key={order._id}
          >
            <div className="myorder-top">
              <div>
                <h3>
                  Order #
                  {order._id.slice(-6)}
                </h3>
                <p>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
              <span
                  className={
                      order.orderStatus === "Approved"
                          ? "status approved"
                          : "status"
                  }
              >
                  {order.orderStatus}
              </span>
              </div>
            </div>
            <hr />
            {order.products.map((item) => (
              <div
                className="myorder-product"
                key={item.productId}
              >
                <img
                  src={item.image}
                  alt=""
                />
                <div>
                  <h4>
                    {item.productName}
                  </h4>
                  <p>
                    Qty : {item.quantity}
                  </p>
                </div>
                <h4>
                  ₹{item.price}
                </h4>
              </div>
            ))}
            <hr />
            {order.orderStatus === "Cancelled" ? (
              <div className="cancelled-order">
                  <h3>❌ Order Cancelled</h3>
                  <p>
                      This order has been cancelled. If you have any questions,
                      please contact our support team.
                  </p>
              </div>
             ) : (
            <div className="order-tracker">
              {orderSteps.map((step, index) => (
                <div
                  key={step}
                  className={
                    index <= getStepIndex(order.orderStatus)
                      ? "tracker-step active"
                      : "tracker-step"
                  }
                >
                <div className="tracker-circle">
                     {step.icon}
                  </div>
                  <span>
                      {step.title}
                  </span>
                </div>
              ))}
            </div>
            )}
            <div className="delivery-box">
                <h4>
                    🚚 Estimated Delivery
                </h4>
                <h4>
                  📦 Tracking ID
                  </h4>
                  <p>
                  EMT-{order._id.slice(-8).toUpperCase()}
                  </p>
                <p>
                    {getEstimatedDelivery(order.createdAt)}
                </p>
            </div>
            <div className="myorder-bottom">
            <div className="order-price-details">
              <p>
                <strong>Original Amount :</strong>
                ₹{order.originalAmount}
              </p>
              {order.couponCode && (
                <>
                  <p>
                    <strong>Coupon :</strong>
                    {order.couponCode}
                  </p>
                  <p>
                    <strong>Discount :</strong>
                    {order.discountPercentage}%
                  </p>
                  <p>
                    <strong>Discount Amount :</strong>
                    -₹{order.discountAmount}
                  </p>
                </>
              )}
              <h3>
                Final Amount :
                ₹{order.totalAmount}
              </h3>
              <p>
                <strong>Payment :</strong>
                {order.paymentStatus}
              </p>
            </div>
            </div>
          <button
              className="invoice-btn"
              onClick={() => generateInvoice(order)}
          >
              📄 Download Invoice
          </button>
          </div>
        ))
      )}
    </div>
  );
};
export default MyOrders;