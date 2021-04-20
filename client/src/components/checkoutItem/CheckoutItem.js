import React from "react";
import { connect } from "react-redux";

import {
  clearItemFromCart,
  addItem,
  removeItem,
} from "../../redux/cart/actions";

import "./checkoutItem.scss";

const CheckoutItem = ({ cartItem, clearItemFromCart, addItem, removeItem }) => {
  const { name, imageUrl, price, quantity } = cartItem;

  const clearItem = () => {
    clearItemFromCart(cartItem);
  };

  const incrementItem = () => {
    addItem(cartItem);
  };

  const decrementItem = () => {
    removeItem(cartItem);
  };

  return (
    <div className="checkout-item">
      <div className="image-container">
        <img src={imageUrl} alt="item" />
      </div>

      <span className="name">{name}</span>
      <span className="quantity">
        <div className="arrow" onClick={decrementItem}>
          &#10094;
        </div>
        <span className="value">{quantity}</span>
        <div className="arrow" onClick={incrementItem}>
          &#10095;
        </div>
      </span>
      <span className="price">${price}</span>
      <div className="remove-button" onClick={clearItem}>
        &#10005;
      </div>
    </div>
  );
};

export default connect(null, { clearItemFromCart, addItem, removeItem })(
  CheckoutItem
);
