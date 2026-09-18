import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
} from "../../redux/cart/cartSelectors";
import { toggleCartHidden } from "../../redux/cart/actions";
import CartItem from "../cartItem/CartItem";
import CustomButton from "../customButton/CustomButton";

import "./cartDropdown.scss";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(value) || 0,
  );

const CartDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemsCount);
  const total = useSelector(selectCartTotal);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const trigger = document.getElementById("site-cart-trigger");
      const focusIsRelevant =
        dropdownRef.current?.contains(document.activeElement) ||
        document.activeElement === trigger;

      if (event.key === "Escape" && focusIsRelevant) {
        dispatch(toggleCartHidden());
        window.requestAnimationFrame(() => trigger?.focus());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const navigateAndClose = (path) => {
    navigate(path);
    dispatch(toggleCartHidden());
  };

  return (
    <section
      id="site-cart-dropdown"
      ref={dropdownRef}
      className="cart-dropdown"
      role="region"
      aria-labelledby="site-cart-dropdown-title"
    >
      <div className="cart-dropdown__header">
        <span id="site-cart-dropdown-title">Shopping bag</span>
        <span>
          {itemCount
            ? `${itemCount} item${itemCount === 1 ? "" : "s"}`
            : "Empty"}
        </span>
      </div>

      <div className="cart-items">
        {cartItems.length ? (
          cartItems.map((item) => <CartItem key={item.id} item={item} />)
        ) : (
          <div className="cart-dropdown__empty">
            <p>Your bag is empty.</p>
            <button type="button" onClick={() => navigateAndClose("/shop")}>
              Explore the shop
            </button>
          </div>
        )}
      </div>

      {cartItems.length > 0 && (
        <>
          <div
            className="cart-dropdown__subtotal"
            aria-live="polite"
            aria-label={`Subtotal ${formatMoney(total)}`}
          >
            <span>Subtotal</span>
            <strong>{formatMoney(total)}</strong>
          </div>
          <CustomButton onClick={() => navigateAndClose("/checkout")}>
            REVIEW BAG & PAY
          </CustomButton>
          <button
            type="button"
            className="cart-dropdown__continue"
            onClick={() => navigateAndClose("/shop")}
          >
            Continue shopping
          </button>
        </>
      )}
    </section>
  );
};

export default CartDropdown;
