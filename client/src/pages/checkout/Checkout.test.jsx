import { fireEvent, render, screen, within } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import Checkout from "@/pages/checkout/Checkout";
import cartReducer from "@/redux/cart/cartReducer";

jest.mock("@/components/stripeButton/StripeButton", () => ({
  __esModule: true,
  default: ({ onSuccess }) => (
    <button onClick={onSuccess}>Confirm test payment</button>
  ),
}));
const item = {
  id: 1,
  name: "Test jacket",
  price: 50,
  quantity: 1,
  imageUrl: "/jacket.png",
};
const setup = (cartItems = [item]) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: { cart: { hidden: true, cartItems } },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    </Provider>,
  );
  return store;
};

it("updates quantities and totals, then explicitly removes an item", () => {
  const store = setup();
  const summary = within(
    screen.getByRole("complementary", { name: "Amount due" }),
  );
  expect(summary.getAllByText("$50.00")).toHaveLength(2);
  fireEvent.click(
    screen.getByRole("button", { name: /Increase test jacket quantity/ }),
  );
  expect(summary.getAllByText("$100.00")).toHaveLength(2);
  fireEvent.click(
    screen.getByRole("button", { name: /Decrease test jacket quantity/ }),
  );
  expect(
    screen.getByRole("button", { name: /Decrease test jacket quantity/ }),
  ).toBeDisabled();
  fireEvent.click(
    screen.getByRole("button", { name: /Remove Test jacket from bag/ }),
  );
  expect(
    screen.getByRole("heading", { name: "Your bag is empty" }),
  ).toBeInTheDocument();
  expect(store.getState().cart.cartItems).toEqual([]);
});

it("preserves the paid amount in a receipt while clearing the bag", () => {
  const store = setup([{ ...item, quantity: 2 }]);
  fireEvent.click(screen.getByRole("button", { name: "Confirm test payment" }));
  expect(
    screen.getByRole("heading", { name: /Your payment was received/ }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/\$100.00 was submitted for 2 items/),
  ).toBeInTheDocument();
  expect(store.getState().cart.cartItems).toEqual([]);
  expect(
    screen.queryByRole("button", { name: "Confirm test payment" }),
  ).not.toBeInTheDocument();
});

it("never offers payment when the bag is empty", () => {
  setup([]);
  expect(
    screen.getByRole("heading", { name: "Your bag is empty" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Confirm test payment" }),
  ).not.toBeInTheDocument();
});
