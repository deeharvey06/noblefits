import { combineReducers } from "@reduxjs/toolkit";
import { createTransform, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./user/userReducer";
import cartReducer from "./cart/cartReducer";
import directoryReducer from "./directory/directoryReducer";
import shopReducer from "./shop/shopReducer";

const sanitizeCartItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && item.id != null && typeof item.name === "string")
    .map((item) => ({
      ...item,
      price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    }))
    .filter((item) => item.price >= 0);
};

export const cartPersistTransform = createTransform(
  (inboundState) => ({
    cartItems: sanitizeCartItems(inboundState?.cartItems),
  }),
  (outboundState) => ({
    hidden: true,
    cartItems: sanitizeCartItems(outboundState?.cartItems),
  }),
  { whitelist: ["cart"] }
);

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["cart"],
  transforms: [cartPersistTransform],
};

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  directory: directoryReducer,
  shop: shopReducer,
});

export default persistReducer(persistConfig, rootReducer);
