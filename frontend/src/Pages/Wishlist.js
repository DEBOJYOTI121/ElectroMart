import React, { useEffect, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import "./CSS/Wishlist.css";
import { API_URL } from "../config";

const Wishlist = () => {

    const {
        wishlistItems,
        fetchWishlist,
        addToCart
    } = useContext(ShopContext);


    // Load wishlist when page opens
    useEffect(() => {
        fetchWishlist();
    }, []);


    // MOVE PRODUCT TO CART
    const moveToCart = async (productId) => {

        const token = localStorage.getItem("auth-token");

        if (!token) {
            alert("Please login first.");
            return;
        }

        try {

            // First add product to cart
            await addToCart(productId);

            // Then remove product from wishlist
            const response = await fetch(
                `${API_URL}/removefromwishlist`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                    body: JSON.stringify({
                        productId: productId,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                await fetchWishlist();
            }

        } catch (error) {
            console.error("Move To Cart Error:", error);
        }
    };


    // REMOVE FROM WISHLIST
    const removeWishlist = async (productId) => {

        const token = localStorage.getItem("auth-token");

        if (!token) {
            alert("Please login first.");
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/removefromwishlist`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                    body: JSON.stringify({
                        productId: productId,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                await fetchWishlist();
            }

        } catch (error) {
            console.error("Remove Wishlist Error:", error);
        }
    };


    return (
        <div className="wishlist">

            <h1>My Wishlist</h1>

            {wishlistItems.length === 0 ? (

                <h2>Your Wishlist is Empty ❤️</h2>

            ) : (

                wishlistItems.map((item) => (

                    <div
                        className="wishlist-card"
                        key={item.id}
                    >

                        <img
                            src={item.image}
                            alt={item.name}
                        />

                        <div className="wishlist-details">

                            <h3>{item.name}</h3>

                            <p>
                                ₹{item.new_price}
                            </p>

                            <div className="wishlist-buttons">

                                <button
                                    className="move-cart-btn"
                                    onClick={() => moveToCart(item.id)}
                                >
                                    Move to Cart
                                </button>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeWishlist(item.id)}
                                >
                                    🗑 Remove
                                </button>

                            </div>

                        </div>

                    </div>

                ))
            )}

        </div>
    );
};

export default Wishlist;