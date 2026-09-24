import { cartPersistTransform } from "@/redux/rootReducer";
import { selectCartTotal } from "@/redux/cart/cartSelectors";

const item = { id: 1, name: "Jacket", price: 50, quantity: 2 };
it("persists merchandise but resets the transient drawer state after reload", () => {
  const saved = cartPersistTransform.in(
    { hidden: false, cartItems: [item] },
    "cart",
  );
  expect(saved).toEqual({ cartItems: [item] });
  expect(cartPersistTransform.out(saved, "cart")).toEqual({
    hidden: true,
    cartItems: [item],
  });
});

it("recovers from missing or malformed saved cart data", () => {
  for (const saved of [
    null,
    {},
    { cartItems: "corrupted" },
    { cartItems: [null, {}, { id: 2 }] },
  ]) {
    expect(cartPersistTransform.out(saved, "cart").cartItems).toEqual([]);
  }
});

it("rejects invalid prices and normalizes corrupted quantities so totals remain finite", () => {
  const restored = cartPersistTransform.out(
    {
      cartItems: [
        { ...item, quantity: Infinity },
        { ...item, id: 2, price: "invalid" },
        { ...item, id: 3, price: -5 },
        { ...item, id: 4, price: "25", quantity: 2.8 },
      ],
    },
    "cart",
  );
  expect(restored.cartItems).toEqual([
    { ...item, quantity: 1 },
    { ...item, id: 4, price: 25, quantity: 2 },
  ]);
  expect(selectCartTotal({ cart: restored })).toBe(100);
});
