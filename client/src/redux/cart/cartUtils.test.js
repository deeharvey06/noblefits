import { addItemToCart, decrementItemInCart } from "./cartUtils";

const item = { id: 1, name: "Sneakers", price: 90 };

describe("cart utilities", () => {
  it("adds a new item with quantity one", () => {
    expect(addItemToCart([], item)).toEqual([{ ...item, quantity: 1 }]);
  });

  it("increments an existing cart item", () => {
    expect(addItemToCart([{ ...item, quantity: 1 }], item)[0].quantity).toBe(2);
  });

  it("decrements quantity instead of deleting the line item", () => {
    const result = decrementItemInCart([{ ...item, quantity: 2 }], item);
    expect(result).toEqual([{ ...item, quantity: 1 }]);
  });

  it("removes an item when quantity reaches zero", () => {
    expect(decrementItemInCart([{ ...item, quantity: 1 }], item)).toEqual([]);
  });
});
