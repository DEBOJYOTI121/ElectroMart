import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Checkout.css";
import { ShopContext } from "../Context/ShopContext";
import { useLocation } from "react-router-dom";

const Checkout = () => {

    const {
        all_product,
        cartItems,
        getTotalCartAmount
    } = useContext(ShopContext);
    const navigate = useNavigate();
    const location = useLocation();
    const {
    couponCode = "",
    discount = 0,
    discountAmount = 0,
    finalAmount = getTotalCartAmount(),
    } = location.state || {};
    const [address, setAddress] = useState({

    customerName: localStorage.getItem("user-name") || "",

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

        alert("Please fill all required address fields.");

        return;

    }

    localStorage.setItem(

        "delivery-address",

        JSON.stringify(address)

    );
    navigate("/cart/payment", {
    state: {
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
                    onChange={handleChange}
                />

                <input
                    type="text"
                    placeholder="Street"
                    name="street"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    placeholder="City"
                    name="city"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    placeholder="State"
                    name="state"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    placeholder="PIN Code"
                    name="pincode"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    name="landmark"
                    onChange={handleChange}
                />

            </div>

            <div className="checkout-right">

                <h2>Order Summary</h2>

                {

                    all_product.map(product=>{
                        console.log("ALL PRODUCTS", all_product);
                        console.log("CART ITEMS", cartItems);
                        if(cartItems[product.id]>0){

                            return(

                                <div
                                    className="summary-item"
                                    key={product.id}
                                >

                                    <img
                                        src={product.image}
                                        alt=""
                                    />

                                    <div>

                                        <h4>{product.name}</h4>

                                        <p>

                                            Qty :

                                            {cartItems[product.id]}

                                        </p>

                                    </div>

                                    <h4>

                                        ₹

                                        {product.new_price*cartItems[product.id]}

                                    </h4>

                                </div>

                            )

                        }

                        return null;

                    })

                }
                <hr />
                <div className="checkout-summary">

                    <div className="checkout-total">
                        <p>Subtotal</p>
                        <p>₹{getTotalCartAmount()}</p>
                    </div>

                    {discount > 0 && (
                        <div className="checkout-total">
                            <p>Discount ({discount}%)</p>
                            <p>- ₹{discountAmount.toFixed(2)}</p>
                        </div>
                    )}

                    <hr />

                    <div className="checkout-total final-total">
                        <h2>Total</h2>
                        <h2>₹{finalAmount.toFixed(2)}</h2>
                    </div>

                </div>

                <button onClick={continueToPayment}>
                    Continue To Payment
                </button>

            </div>

        </div>

    );

};

export default Checkout;