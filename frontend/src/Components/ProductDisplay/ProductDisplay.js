import React, { useContext, useState, useEffect } from 'react';
import './ProductDisplay.css';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { API_URL } from '../../config';
const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const submitReview = async () => {
  const token = localStorage.getItem("auth-token");
  if (!token) {
        alert("Please login first.");
        return;
    }
  try {
        const response = await fetch(`${API_URL}/addreview`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
            body: JSON.stringify({
                productId: product.id,
                rating: reviewRating,
                comment: reviewComment,
            }),
        });
        const data = await response.json();
        alert(data.message);
        if (data.success) {
            window.location.reload();
        }
    } catch (err) {
        console.log(err);
    }
  };
  const toggleWishlist = async () => {

    const token = localStorage.getItem("auth-token");

    if (!token) {
        alert("Please login first.");
        return;
    }

    try {

        const url = isWishlisted
        ? `${API_URL}/removefromwishlist`
        : `${API_URL}/addtowishlist`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
            body: JSON.stringify({
                productId: product.id,
            }),
        });

        const data = await response.json();

        if (data.success) {
           setIsWishlisted(!isWishlisted);
        }

        alert(data.message);

    } catch (error) {
        console.log(error);
    }
  };
   useEffect(() => {
    const checkWishlistStatus = async () => {
        const token = localStorage.getItem("auth-token");

        if (!token) return;

        try {
            const response = await fetch(
                `${API_URL}/getwishlist`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                    body: JSON.stringify({})
                }
            );

            const data = await response.json();

            if (data.success) {
                const exists = data.wishlist.some(
                    (item) => item.id === product.id
                );

                setIsWishlisted(exists);
            }

        } catch (error) {
            console.log(error);
        }
    };

    checkWishlistStatus();

}, [product.id]);
  return (
    <div className='productdisplay'>
      <div className="productdisplay-left">
         <div className="productdisplay-img-list">
          {[1,2,3,4].map((item,index)=>(
              <img
                  key={index}
                  src={product.image}
                  alt=""
                  className={
                      selectedImage===product.image
                      ?
                      "active-thumb"
                      :
                      ""
                  }
                  onClick={()=>setSelectedImage(product.image)}
              />
          ))}
       </div>
        <div className="productdisplay-img">
          <img
            className="productdisplay-main-img"
            src={selectedImage}
            alt=""
           />
        </div>
      </div>
      <div className='productdisplay-right'>
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122 Reviews)</p>
        </div>
        <div className="productdisplay-right-prices">
            <div className="productdisplay-right-price-new">
                ₹{product.new_price}
            </div>
            <div className="productdisplay-right-price-old">
                ₹{product.old_price}
            </div>
        </div>
        <div className="product-save">
            🔥 Save ₹
            {product.old_price - product.new_price}
            {" ("}
            {Math.round(
                ((product.old_price - product.new_price) /
                    product.old_price) *
                    100
            )}
            % OFF)
        </div>
        <div className="productdisplay-right-description">
          Premium quality electrical product designed for durability,
          safety, and modern home installation.
        </div>
        <div className="product-stock">
          {product.countInStock === 0 ? (
              <span className="stock-out">
                  ❌ Out of Stock
              </span>
          ) : product.countInStock <= 5 ? (

              <span className="stock-low">
                  ⚠ Only {product.countInStock} Left in Stock
              </span>
          ) : (
              <span className="stock-in">
                  ✅ In Stock ({product.countInStock} Available)
              </span>

          )}
        </div>
        <div className="quantity-wrapper">
            <p className="quantity-title">
                Quantity
            </p>
            <div className="quantity-section">
                <button
                    className="qty-btn"
                    onClick={() =>
                        quantity > 1 &&
                        setQuantity(quantity - 1)
                    }
                >
                    −
                </button>
                <span className="qty-value">

                    {quantity}

                </span>
                <button
                    className="qty-btn"
                    onClick={() =>
                        quantity < product.countInStock &&
                        setQuantity(quantity + 1)
                    }
                >
                    +
                </button>
            </div>
         </div>
        <button
            className="wishlist-btn"
            onClick={toggleWishlist}
        >
            {
                isWishlisted ?
                <>
                    <FaHeart />
                    Remove from Wishlist
                </>
                :
                <>
                    <FaRegHeart />
                    Add to Wishlist
                </>
            }
        </button>
        <button
            disabled={product.countInStock === 0}
            onClick={() => {
                for (let i = 0; i < quantity; i++) {
                    addToCart(product.id);
                }
            }}
              >
            {
                product.countInStock === 0
                    ? "OUT OF STOCK"
                    : "ADD TO CART"
            }
        </button>
        <button
          className="buy-now-btn"
          disabled={product.countInStock === 0}
          onClick={() => {

              for (let i = 0; i < quantity; i++) {

                  addToCart(product.id);

              }

              navigate("/checkout");

          }}
         >
          BUY NOW
        </button>
      <div className="product-benefits">
        <div className="benefit-item">
            <span className="benefit-icon">🚚</span>
            <div>
                <h4>Free Delivery</h4>
                <p>Expected in 2-4 business days</p>
            </div>
        </div>
        <div className="benefit-item">
            <span className="benefit-icon">🔒</span>
            <div>
                <h4>Secure Payment</h4>
                <p>100% Safe & Secure Checkout</p>
            </div>
        </div>
        <div className="benefit-item">
            <span className="benefit-icon">↩️</span>
            <div>
                <h4>Easy Return</h4>
                <p>7-Day Return Policy</p>
            </div>
        </div>
        <div className="benefit-item">
            <span className="benefit-icon">🛡️</span>
            <div>
                <h4>Genuine Product</h4>
                <p>100% Original Electrical Products</p>
            </div>
        </div>
      </div>
    <div className="product-reviews">
        <h2>Customer Reviews</h2>
      {
        product.reviews && product.reviews.length > 0 ?
        product.reviews.map((review,index)=>(
            <div className="review-card" key={index}>
                <h4>{review.userName}</h4>
                <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                </div>
                <p>{review.comment}</p>
                <small>
                    {new Date(review.createdAt).toLocaleDateString()}
                </small>
            </div>
        ))
        :
        <p>No reviews yet.</p>
        }
      </div>
      <div className="write-review">
            <h3>Write a Review</h3>
            <label>Rating</label>
            <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
            >
                <option value={5}>★★★★★</option>
                <option value={4}>★★★★☆</option>
                <option value={3}>★★★☆☆</option>
                <option value={2}>★★☆☆☆</option>
                <option value={1}>★☆☆☆☆</option>
            </select>
            <textarea
                placeholder="Write your review..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
            />
            <button onClick={submitReview}>
                Submit Review
            </button>
        </div> 
      </div>
    </div>
  );
};

export default ProductDisplay;