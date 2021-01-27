import React from "react";
import { connect } from "react-redux";

import CustomButton from "../customButton/CustomButton";
import CartItem from "../cartItem/CartItem";

import "./cartDropdown.scss";

const CartDropdown = ({ cartItems }) => {
  const renderCartItems = () =>
    cartItems.map((item) => <CartItem key={item.id} item={item} />);

  return (
    <div className="cart-dropdown">
      <div className="cart-items">{renderCartItems()}</div>
      <CustomButton>GO TO CHECKOUT</CustomButton>
    </div>
  );
};

const mapStateToProps = ({ cart }) => ({
  cartItems: cart.cartItems,
});

export default connect(mapStateToProps)(CartDropdown);
