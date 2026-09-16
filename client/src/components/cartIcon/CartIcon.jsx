import { useDispatch, useSelector } from "react-redux";

import shoppingBagUrl from "../../assets/shopping-bag.svg";
import { toggleCartHidden } from "../../redux/cart/actions";
import { selectCartHidden, selectCartItemsCount } from "../../redux/cart/cartSelectors";

import "./cartIcon.scss";

const CartIcon = () => {
  const dispatch = useDispatch();
  const itemCount = useSelector(selectCartItemsCount);
  const hidden = useSelector(selectCartHidden);

  return (
    <button
      type="button"
      id="site-cart-trigger"
      className="cart-icon"
      onClick={() => dispatch(toggleCartHidden())}
      aria-label={`${hidden ? "Open" : "Close"} shopping bag with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      aria-expanded={!hidden}
      aria-controls="site-cart-dropdown"
    >
      <img className="shopping-icon" src={shoppingBagUrl} alt="" aria-hidden="true" />
      <span key={itemCount} className="item-count" aria-hidden="true">{itemCount}</span>
    </button>
  );
};

export default CartIcon;
