import { createSelector } from "reselect";

const selectCart = (state) => state.cart;

export const selectCartItems = createSelector(
  [selectCart],
  (cart) => cart.cartItems
);

const itemTotal = (accumulatedQuantity, cartItem) =>
  accumulatedQuantity + cartItem.quantity;

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  (cartItems) => cartItems.reduce(itemTotal, 0)
);
