import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
const Item = (props) => {
  return (
    <div className='item'>
     <div className="item-image">
      {props.countInStock === 0 ? (
          <span className="stock-badge out">
              ✖ Out of Stock
          </span>
      ) : props.countInStock <= 5 ? (
          <span className="stock-badge low">
              Only {props.countInStock} Left
          </span>
      ) : (
          <span className="stock-badge in">
              ✓ In Stock
          </span>
      )}
    <Link to={`/product/${props.id}`}>
        <img
            onClick={() => window.scrollTo(0, 0)}
            src={props.image}
            alt=""
        />
  </Link>
  </div>
    <p>{props.name}</p>
    <div className="item-prices">
        <div className="item-price-new">
          ₹{props.new_price}
        </div>
        <div className="item-price-old">
          ₹{props.old_price}
        </div>
      </div>

    </div>
  );
};

export default Item;