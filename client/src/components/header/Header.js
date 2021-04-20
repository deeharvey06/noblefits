import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";


import CartIcon from "../cartIcon/CartIcon";
import CartDropdown from "../cartDropdown/CartDropdown";

import { selectCurrentUser } from "../../redux/user/userSelector";
import { selectCartHidden } from "../../redux/cart/cartSelectors";
import { signOutStart } from "../../redux/user/actions";

import { ReactComponent as Logo } from "../../assets/crown.svg";

import "./header.scss";

const Header = ({ currentUser, hidden, signOutStart }) => {
  const renderSignInAndSignOutButton = () => {
    return currentUser ? (
      <div className="option" onClick={signOutStart}>
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

// createStructuredSelector pass root state to the callbacks methods
const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  hidden: selectCartHidden,
});

const mapDispatchToProps = dispatch => ({
  signOutStart: () => dispatch(signOutStart())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header);
