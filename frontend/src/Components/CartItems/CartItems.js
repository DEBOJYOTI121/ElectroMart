import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CartItems.css";
import { API_URL } from "../../config";
import { ShopContext } from "../../Context/ShopContext";

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    deleteFromCart
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/applycoupon`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code: couponCode
        })
      });

      const data = await response.json();

      if (data.success) {
        const subtotal = getTotalCartAmount();

        const discountValue =
          (subtotal * Number(data.discount)) / 100;

        setDiscount(Number(data.discount));
        setDiscountAmount(discountValue);
        setCouponApplied(true);

        alert(data.message);
      } else {
        setDiscount(0);
        setDiscountAmount(0);
        setCouponApplied(false);

        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  const proceedToCheckout = () => {
    const subtotal = getTotalCartAmount();

    const finalAmount =
      subtotal - discountAmount;

    /*
      IMPORTANT:
      Create an exact snapshot of the cart at checkout time.
      This snapshot will travel through Checkout -> Payment -> Order.
    */
    const checkoutItems = all_product
      .filter((product) => {
        return (
          cartItems[product.id] &&
          cartItems[product.id] > 0
        );
      })
      .map((product) => ({
        productId: Number(product.id),
        quantity: Number(cartItems[product.id])
      }));

    if (checkoutItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    navigate("/checkout", {
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
    <div className="cartitems">

      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
      </div>

      <hr />

      {all_product.map((e) => {

        if (cartItems[e.id] && cartItems[e.id] > 0) {
          return (
            <div key={e.id}>

              <div className="cartitems-format cartitems-format-main">

                <img
                  src={e.image}
                  alt=""
                  className="carticon-product-icon"
                />

                <p>{e.name}</p>

                <p>₹{e.new_price}</p>

                <div className="cartitems-quantity-controls">

                  <button
                    onClick={() => removeFromCart(e.id)}
                  >
                    -
                  </button>

                  <span>
                    {cartItems[e.id]}
                  </span>

                  <button
                    onClick={() => addToCart(e.id)}
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() => deleteFromCart(e.id)}
                >
                  Remove
                </button>

                <p>
                  ₹
                  {e.new_price * cartItems[e.id]}
                </p>

              </div>

              <hr />

            </div>
          );
        }

        return null;
      })}

      <div className="cartitems-down">

        <div className="cartitems-total">

          <h1>Cart Totals</h1>

          <div className="cartitems-total-item">
            <p>Subtotal</p>
            <p>₹{getTotalCartAmount()}</p>
          </div>

          <hr />

          <div className="cartitems-total-item">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>

          <hr />

          {couponApplied && (
            <div className="cartitems-total-item">
              <p>Discount ({discount}%)</p>
              <p>
                - ₹{discountAmount.toFixed(2)}
              </p>
            </div>
          )}

          <div className="cartitems-total-item">

            <h3>Total</h3>

            <h3>
              ₹
              {(
                getTotalCartAmount() -
                discountAmount
              ).toFixed(2)}
            </h3>

          </div>

          <button onClick={proceedToCheckout}>
            PROCEED TO CHECKOUT
          </button>

        </div>

        <div className="cartitems-promocode">

          <p>
            If you have a promo code, enter it here
          </p>

          <div className="cartitems-promobox">

            <input
              type="text"
              placeholder="Promo code"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(e.target.value)
              }
            />

            <button onClick={applyCoupon}>
              Apply
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CartItems;