import { formatMoney } from "@/utils/formatMoney";
import { useDispatch } from "react-redux";

import { QuantityControl, ResilientImage } from "@/design-system";
import { addItem, clearItemFromCart, removeItem } from "@/redux/cart/actions";

import "./checkoutItem.scss";

const getVariantDetails = (cartItem) =>
  [cartItem.variant, cartItem.size, cartItem.color].filter(Boolean);

const CheckoutItem = ({ cartItem }) => {
  const dispatch = useDispatch();
  const { name, imageUrl, price, quantity } = cartItem;
  const variantDetails = getVariantDetails(cartItem);
  const lineTotal = Number(price) * quantity;

  return (
    <article
      className="checkout-item"
      aria-label={`${name}, quantity ${quantity}`}
    >
      <div className="checkout-item__image-wrap">
        <ResilientImage
          className="checkout-item__image"
          src={imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="checkout-item__details">
        <div className="checkout-item__identity">
          <h3 className="checkout-item__name">{name}</h3>
          {variantDetails.length > 0 && (
            <p className="checkout-item__variant">
              {variantDetails.join(" · ")}
            </p>
          )}
          <p className="checkout-item__unit-price">{formatMoney(price)} each</p>
        </div>

        <div className="checkout-item__controls">
          <div>
            <span className="checkout-item__control-label">Quantity</span>
            <QuantityControl
              value={quantity}
              min={1}
              label={`${name} quantity`}
              onDecrease={() => dispatch(removeItem(cartItem))}
              onIncrease={() => dispatch(addItem(cartItem))}
            />
          </div>

          <button
            type="button"
            className="checkout-item__remove"
            onClick={() => dispatch(clearItemFromCart(cartItem))}
            aria-label={`Remove ${name} from bag`}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="checkout-item__line-total">
        <span>Item total</span>
        <strong>{formatMoney(lineTotal)}</strong>
      </div>
    </article>
  );
};

export default CheckoutItem;
