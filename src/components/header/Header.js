import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { auth } from "../.././firebase/firebase.utils";

import CartIcon from "../../components/cartIcon/CartIcon";
import CartDropdown from "../../components/cartDropdown/CartDropdown";

import { ReactComponent as Logo } from "../../assets/crown.svg";

import "./header.scss";

const Header = ({ currentUser, hidden }) => {
  const renderSignInAndSignOutButton = () => {
    return currentUser ? (
      <div className="option" onClick={() => auth.signOut()}>
        SIGN OUT
      </div>
    ) : (
      <Link className="option" to="/signin">
        SIGN IN
      </Link>
    );
  };

  const renderCartDropdown = () => !hidden && <CartDropdown />;

  return (
    <div className="header">
      <Link className="logo-container" to="/">
        <Logo className="logo" />
      </Link>

      <div className="options">
        <Link className="option" to="/shop">
          SHOP
        </Link>
        <Link className="option" to="/contact">
          CONTACT
        </Link>
        {renderSignInAndSignOutButton()}
        <CartIcon />
      </div>
      {renderCartDropdown()}
    </div>
  );
};

const mapStateToProps = ({ user, cart }) => ({
  currentUser: user.currentUser,
  hidden: cart.hidden,
});

export default connect(mapStateToProps, {})(Header);
