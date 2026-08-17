import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { useLocation } from "react-router-dom";
import { API_URL } from "../config";
const Payment = () => {
     const navigate = useNavigate();
     const location = useLocation();
     const {
     couponCode = "",
     discount = 0,
     discountAmount = 0,
     finalAmount = 0
    } = location.state || {};
    const { loadCartData } = useContext(ShopContext);
    
    const payNow = async () => {

        try {

            const response = await fetch(
                `${API_URL}/create-razorpay-order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: finalAmount,
                    }),
                }
            );

            const data = await response.json();
             const options = {

    key: "rzp_test_T8GYzarz4xwsGh",

    amount: data.order.amount,

    currency: data.order.currency,

    name: "ElectroMart",

    description: "ElectroMart Order Payment",

    image: "https://razorpay.com/assets/razorpay-logo.svg",

    order_id: data.order.id,
    handler: async function (response) {

        const verify = await fetch(
            `${API_URL}/verify-payment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(response)
            }
        );

        const verifyData = await verify.json();

if (verifyData.success) {

    const deliveryAddress = JSON.parse(
        localStorage.getItem("delivery-address")
    );

    const token = localStorage.getItem("auth-token");
    const placeOrder = await fetch(
        `${API_URL}/placeorder`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify({

            customerName: deliveryAddress.customerName,

            customerMobile: deliveryAddress.customerMobile,

            deliveryAddress: {
                house: deliveryAddress.house,
                street: deliveryAddress.street,
                city: deliveryAddress.city,
                state: deliveryAddress.state,
                pincode: deliveryAddress.pincode,
                landmark: deliveryAddress.landmark
            },

            paymentStatus: "Paid",

            razorpayOrderId: response.razorpay_order_id,

            razorpayPaymentId: response.razorpay_payment_id,

            paymentTime: new Date(),

            couponCode: couponCode,

            discount: discount,

            discountAmount: discountAmount,

            finalAmount: finalAmount
        })
        }
    );
    const orderData = await placeOrder.json();
    console.log(orderData);
    if (orderData.success) {

        await loadCartData();   // <-- refresh cart from backend

          alert( "Payment Successful!");

          localStorage.removeItem("delivery-address");

          navigate("/myorders");

      }
     }
    },

    prefill: {

        name: localStorage.getItem("user-name"),

        email: localStorage.getItem("user-email"),

        contact: localStorage.getItem("user-mobile")

    },

    theme: {

        color: "#2563eb"

    }

};

const razorpay = new window.Razorpay(options);

razorpay.open();

        } catch (error) {
            console.log(error);
        }

    };
   
    return (
        <div
            style={{
                width: "90%",
                margin: "60px auto",
                textAlign: "center",
            }}
        >
            <h1>Payment Page</h1>

            <button
                onClick={payNow}
                style={{
                    padding: "15px 40px",
                    marginTop: "30px",
                    fontSize: "18px",
                    cursor: "pointer",
                }}
            >
                Pay Now
            </button>
        </div>
    );
};

export default Payment;