import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { API_URL } from "../config";

const Payment = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const {
    checkoutItems = [],
    couponCode = "",
    discount = 0,
    discountAmount = 0,
    finalAmount = 0
  } = location.state || {};

  const {
    loadCartData
  } = useContext(ShopContext);

  const payNow = async () => {

    try {

      if (!checkoutItems.length) {

        alert(
          "Order information is missing. Please return to cart."
        );

        navigate("/cart");

        return;
      }

      if (!finalAmount || finalAmount <= 0) {

        alert(
          "Invalid payment amount."
        );

        return;
      }

      // =====================================
      // CREATE RAZORPAY ORDER
      // =====================================

      const response = await fetch(
        `${API_URL}/create-razorpay-order`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            amount: finalAmount
          })
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.order
      ) {

        console.error(
          "Razorpay order creation failed:",
          data
        );

        alert(
          data.message ||
          "Unable to create payment order."
        );

        return;
      }

      // =====================================
      // RAZORPAY OPTIONS
      // =====================================

      const options = {

        key: "rzp_test_TRJXdVpDZ6K7jZ",

        amount:
          data.order.amount,

        currency:
          data.order.currency,

        name:
          "ElectroMart",

        description:
          "ElectroMart Order Payment",

        image:
          "https://razorpay.com/assets/razorpay-logo.svg",

        order_id:
          data.order.id,

        handler: async function (response) {

          try {

            // =====================================
            // VERIFY PAYMENT
            // =====================================

            const verify =
              await fetch(
                `${API_URL}/verify-payment`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body:
                    JSON.stringify(response)
                }
              );

            const verifyData =
              await verify.json();

            if (!verifyData.success) {

              alert(
                "Payment verification failed."
              );

              return;
            }

            // =====================================
            // DELIVERY ADDRESS
            // =====================================

            const deliveryAddress =
              JSON.parse(
                localStorage.getItem(
                  "delivery-address"
                )
              );

            if (!deliveryAddress) {

              alert(
                "Delivery address not found."
              );

              return;
            }

            // =====================================
            // AUTH TOKEN
            // =====================================

            const token =
              localStorage.getItem(
                "auth-token"
              );

            if (!token) {

              alert(
                "Please login again."
              );

              return;
            }

            // =====================================
            // PLACE ORDER
            // =====================================

            const placeOrder =
              await fetch(
                `${API_URL}/placeorder`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    "auth-token":
                      token
                  },

                  body:
                    JSON.stringify({

                      /*
                        THIS IS THE CRITICAL FIX.
                        Send the exact checkout
                        snapshot to the backend.
                      */
                      checkoutItems,

                      customerName:
                        deliveryAddress.customerName,

                      customerMobile:
                        deliveryAddress.customerMobile,

                      deliveryAddress: {

                        house:
                          deliveryAddress.house,

                        street:
                          deliveryAddress.street,

                        city:
                          deliveryAddress.city,

                        state:
                          deliveryAddress.state,

                        pincode:
                          deliveryAddress.pincode,

                        landmark:
                          deliveryAddress.landmark

                      },

                      paymentStatus:
                        "Paid",

                      razorpayOrderId:
                        response.razorpay_order_id,

                      razorpayPaymentId:
                        response.razorpay_payment_id,

                      paymentTime:
                        new Date().toISOString(),

                      couponCode:
                        couponCode,

                      discount:
                        discount,

                      discountAmount:
                        discountAmount,

                      finalAmount:
                        finalAmount

                    })

                }
              );

            const orderData =
              await placeOrder.json();

            console.log(
              "PLACE ORDER RESPONSE:",
              orderData
            );

            if (
              !placeOrder.ok ||
              !orderData.success
            ) {

              console.error(
                "Order creation failed:",
                orderData
              );

              alert(
                orderData.message ||
                "Payment succeeded but order creation failed."
              );

              return;
            }

            // =====================================
            // SUCCESS
            // =====================================

            await loadCartData();

            localStorage.removeItem(
              "delivery-address"
            );

            alert(
              "Payment Successful!"
            );

            navigate("/myorders");

          } catch (error) {

            console.error(
              "Payment handler error:",
              error
            );

            alert(
              "Something went wrong after payment."
            );

          }

        },

        prefill: {

          name:
            localStorage.getItem(
              "user-name"
            ),

          email:
            localStorage.getItem(
              "user-email"
            ),

          contact:
            localStorage.getItem(
              "user-mobile"
            )

        },

        theme: {
          color: "#2563eb"
        }

      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.error(
        "Payment Error:",
        error
      );

      alert(
        "Unable to start payment."
      );

    }

  };

  return (

    <div
      style={{
        width: "90%",
        margin: "60px auto",
        textAlign: "center"
      }}
    >

      <h1>
        Payment Page
      </h1>

      <button
        onClick={payNow}
        style={{
          padding: "15px 40px",
          marginTop: "30px",
          fontSize: "18px",
          cursor: "pointer"
        }}
      >
        Pay Now
      </button>

    </div>

  );

};

export default Payment;