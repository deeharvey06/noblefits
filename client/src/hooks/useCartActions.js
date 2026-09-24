import { useDispatch } from "react-redux";
import { addItem } from "@/redux/cart/actions";

export const useCartActions = () => {
  const dispatch = useDispatch();
  const addToCart = (product, quantity = 1) => {
    if (!product || product.available === false || product.inStock === false)
      return;
    const count = Number(quantity);
    if (!Number.isSafeInteger(count) || count < 1) return;
    const { id, name, imageUrl, price } = product;
    for (let index = 0; index < count; index += 1) {
      dispatch(addItem({ id, name, imageUrl, price }));
    }
  };
  return { addToCart };
};
