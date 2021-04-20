import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { withRouter } from "react-router-dom";

import CustomButton from "../customButton/CustomButton";
import CartItem from "../cartItem/CartItem";

import { selectCartItems } from "../../redux/cart/cartSelectors";
import { toggleCartHidden } from "../../redux/cart/actions";

import "./cartDropdown.scss";

const CartDropdown = ({ cartItems, history, toggleCartHidden }) => {
  const shouldRenderMessage = () =>
    cartItems.length ? renderCartItems() : renderMessage();

  const renderMessage = () => (
    <span className="empty-message">Your cart is empty</span>
  );

  const renderCartItems = () =>
    cartItems.map((item) => <CartItem key={item.id} item={item} />);

  const handleClick = () => {
    history.push("/checkout");
    toggleCartHidden();
  };

  return (
    <div className="cart-dropdown">
      <div className="cart-items">{shouldRenderMessage()}</div>
      <CustomButton onClick={handleClick}>GO TO CHECKOUT</CustomButton>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  cartItems: selectCartItems,
});

export default withRouter(
  connect(mapStateToProps, { toggleCartHidden })(CartDropdown)
);
