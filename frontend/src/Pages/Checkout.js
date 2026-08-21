import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Checkout.css";
import { ShopContext } from "../Context/ShopContext";
import { useLocation } from "react-router-dom";

const Checkout = () => {

  const {
    all_product
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    checkoutItems = [],
    couponCode = "",
    discount = 0,
    discountAmount = 0,
    finalAmount = 0
  } = location.state || {};

  const [address, setAddress] = useState({

    customerName:
      localStorage.getItem("user-name") || "",

    customerMobile:
      localStorage.getItem("user-mobile") &&
      localStorage.getItem("user-mobile") !== "undefined"
        ? localStorage.getItem("user-mobile")
        : "",

    house: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });

  const handleChange = (e) => {

    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });

  };

  const continueToPayment = async () => {

    if (
      !address.house ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {

      alert(
        "Please fill all required address fields."
      );

      return;
    }

    if (!checkoutItems.length) {

      alert(
        "Checkout items are missing. Please return to cart."
      );

      return;
    }

    /*
      Save delivery address.
    */
    localStorage.setItem(
      "delivery-address",
      JSON.stringify(address)
    );

    /*
      Send the exact checkout snapshot
      to the payment page.
    */
    navigate("/cart/payment", {

      state: {

        checkoutItems,

        couponCode,

        discount,

        discountAmount,

        finalAmount

      }

    });

  };

  return (

    <div className="checkout">

      <div className="checkout-left">

        <h2>Delivery Address</h2>

        <input
          type="text"
          name="customerName"
          placeholder="Full Name"
          value={address.customerName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="customerMobile"
          placeholder="Mobile Number"
          value={address.customerMobile}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="House / Flat No."
          name="house"
          value={address.house}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Street"
          name="street"
          value={address.street}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="City"
          name="city"
          value={address.city}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="State"
          name="state"
          value={address.state}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="PIN Code"
          name="pincode"
          value={address.pincode}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="Landmark (Optional)"
          name="landmark"
          value={address.landmark}
          onChange={handleChange}
        />

      </div>

      <div className="checkout-right">

        <h2>Order Summary</h2>

        {checkoutItems.map((item) => {

          const product = all_product.find(
            (p) =>
              Number(p.id) ===
              Number(item.productId)
          );

          if (!product) {
            return null;
          }

          return (

            <div
              className="summary-item"
              key={item.productId}
            >

              <img
                src={product.image}
                alt={product.name}
              />

              <div>

                <h4>
                  {product.name}
                </h4>

                <p>
                  Qty : {item.quantity}
                </p>

              </div>

              <h4>
                ₹
                {product.new_price *
                  item.quantity}
              </h4>

            </div>

          );

        })}

        <hr />

        <div className="checkout-summary">

          <div className="checkout-total">

            <p>Subtotal</p>

            <p>
              ₹
              {checkoutItems.reduce(
                (total, item) => {

                  const product =
                    all_product.find(
                      (p) =>
                        Number(p.id) ===
                        Number(item.productId)
                    );

                  if (!product) {
                    return total;
                  }

                  return (
                    total +
                    product.new_price *
                    item.quantity
                  );

                },
                0
              )}
            </p>

          </div>

          {discount > 0 && (

            <div className="checkout-total">

              <p>
                Discount ({discount}%)
              </p>

              <p>
                - ₹
                {Number(
                  discountAmount
                ).toFixed(2)}
              </p>

            </div>

          )}

          <hr />

          <div className="checkout-total final-total">

            <h2>Total</h2>

            <h2>
              ₹
              {Number(
                finalAmount
              ).toFixed(2)}
            </h2>

          </div>

        </div>

        <button
          onClick={continueToPayment}
        >
          Continue To Payment
        </button>

      </div>

    </div>

  );

};

export default Checkout;