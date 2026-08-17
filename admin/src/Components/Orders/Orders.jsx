import React, { useEffect, useState } from "react";
import "./Orders.css";
import { API_URL } from "../../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
        "Delete this order permanently?"
    );
    if (!confirmDelete) return;
    try {
        const response = await fetch(
            `${API_URL}/deleteorder`,
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                      "auth-token": localStorage.getItem("admin-token"),
                },
                body: JSON.stringify({
                    orderId,
                }),
            }
        );
        const data = await response.json();
        if(data.success){

            setOrders(prev =>
                prev.filter(order => order._id !== orderId)
            );

        }
    } catch(error){

        console.log(error);
    }
};
  const fetchOrders = async () => {
  try {
    const response = await fetch(
      `${API_URL}/allorders`,
      {
        headers: {
          "auth-token": localStorage.getItem("admin-token"),
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setOrders(data.orders);
    }

  } catch (error) {
    console.log(error);
  }
 };
 useEffect(() => {
    fetchOrders();
  }, []);
const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await fetch(
            `${API_URL}/updateorderstatus`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                      "auth-token": localStorage.getItem("admin-token"),
                },
                body: JSON.stringify({
                    orderId,
                    status,
                }),
            }
        );
        const data = await response.json();
        if (data.success) {
            // Update UI immediately
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, orderStatus: status }
                        : order
                )
            );
            // Sync with MongoDB
            fetchOrders();
        }
    } catch (error) {
        console.log(error);
    }
};

  return (
    <div className="orders-page">

      <h1>Customer Orders</h1>

      {orders.length === 0 ? (
        <div className="no-orders">
          No Orders Yet
        </div>
      ) : (
        orders.map((order) => (
          <div
            className="order-card"
            key={order._id}
          >
            <div className="order-header">

              <div>

                <h3>

                  Order #

                  {order._id.slice(-6).toUpperCase()}

                </h3>

                <span >
                  {new Date(order.createdAt).toLocaleString()}
                </span>

              </div>

              <div className="status-box">
                <span
                  className={`status ${order.orderStatus
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {order.orderStatus}
                </span>
              </div>

            </div>

            <div className="customer-box">

              <h2>{order.customerName}</h2>

              <p>{order.customerEmail}</p>

              <p>{order.customerMobile}</p>

            </div>

            <div className="products-box">

              {order.products.map((item) => (
                <div
                  className="product-row"
                  key={item.productId}
                >
                  <img
                    src={item.image}
                    alt=""
                  />

                  <div className="product-info">

                    <h4>{item.productName}</h4>

                    <p>Quantity : {item.quantity}</p>

                  </div>

                  <h4>
                    ₹{item.price}
                  </h4>

                </div>
              ))}
            </div>
            <div className="order-footer">
              <div className="price-details">
                <p>
                    <strong>Original :</strong>
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
                            {order.discountPercentage}% (-₹{order.discountAmount})
                        </p>
                    </>
                )}
                <h2>
                    ₹{order.totalAmount}
                </h2>
                <small>
                    Payment : {order.paymentStatus}
                </small>
            </div>
             <select
                value={order.orderStatus}
                onChange={(e) =>
                  updateOrderStatus(
                    order._id,
                    e.target.value
                  )
                }
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Packed">
                  Packed
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Out For Delivery">
                  Out For Delivery
                </option>

                <option value="Delivered">
                  Delivered
                </option>
                 <option value="Cancelled">Cancelled</option>
              </select> 
                <button
                className="delete-btn"
                onClick={() => deleteOrder(order._id)}
                >
                🗑 Delete
            </button>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default Orders;