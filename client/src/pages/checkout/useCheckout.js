import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/redux/cart/actions";
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
} from "@/redux/cart/cartSelectors";

export const useCheckout = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartItemsCount);
  const total = useSelector(selectCartTotal);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  const handlePaymentSuccess = () => {
    setPaymentReceipt({ amount: total, itemCount });
    dispatch(clearCart());
  };

  return { cartItems, itemCount, total, paymentReceipt, handlePaymentSuccess };
};
