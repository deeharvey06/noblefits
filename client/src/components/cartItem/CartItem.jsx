import { memo } from "react";

import { ResilientImage } from "../../design-system";

import "./cartItem.scss";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

const CartItem = ({ item: { imageUrl, price, name, quantity } }) => (
  <div className="cart-item">
    <ResilientImage src={imageUrl} alt={name} loading="lazy" decoding="async" />
    <div className="item-details">
      <span className="name">{name}</span>
      <span className="price">
        {quantity} × {formatMoney(price)}
      </span>
      <strong className="line-total">{formatMoney(quantity * price)}</strong>
    </div>
  </div>
);

export default memo(CartItem);
