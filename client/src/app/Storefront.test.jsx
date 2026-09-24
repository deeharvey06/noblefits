import { act, fireEvent, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router";
import Home from "@/pages/home/Home";
import SearchPage from "@/pages/search/SearchPage";
import ProductDetailPage from "@/pages/productDetail/ProductDetailPage";
import cartReducer from "@/redux/cart/cartReducer";
import shopReducer from "@/redux/shop/shopReducer";
import directoryReducer from "@/redux/directory/directoryReducer";
import SHOP_DATA from "@/redux/shop/shopData";
import { ROUTES, productPath } from "@/config/routes";

const renderPage = (element, { path = ROUTES.home, shop } = {}) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      shop: shopReducer,
      directory: directoryReducer,
    },
    preloadedState: {
      shop: shop || {
        collections: SHOP_DATA,
        isFetching: false,
        errorMessage: "",
      },
    },
  });
  const dispatch = jest.spyOn(store, "dispatch");
  let navigate;
  const Navigation = () => {
    navigate = useNavigate();
    return null;
  };
  const view = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Navigation />
        {element}
      </MemoryRouter>
    </Provider>,
  );
  return { ...view, store, dispatch, navigate: (...args) => navigate(...args) };
};

beforeEach(() => window.localStorage.clear());

it("composes the home sections and adds a real product to the bag", () => {
  const { store, dispatch } = renderPage(<Home />);
  expect(
    screen.getByRole("heading", { name: "Build your everyday rotation." }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Outerwear, up close." }),
  ).toBeInTheDocument();
  expect(dispatch).not.toHaveBeenCalled();
  fireEvent.click(screen.getAllByRole("button", { name: /add to cart/i })[0]);
  expect(store.getState().cart.cartItems).toHaveLength(1);
});

it("searches through submitted events, saves history, and follows browser navigation", () => {
  const { navigate } = renderPage(<SearchPage />, { path: ROUTES.search });
  const input = screen.getByRole("searchbox");
  fireEvent.change(input, { target: { value: "Nike" } });
  fireEvent.submit(input.closest("form"));
  expect(screen.getByRole("heading", { name: "“Nike”" })).toBeInTheDocument();
  expect(
    JSON.parse(window.localStorage.getItem("noblefits.recentSearches.v1")),
  ).toEqual(["Nike"]);
  act(() => navigate(`${ROUTES.search}?q=jacket`));
  expect(input).toHaveValue("jacket");
  act(() => navigate(-1));
  expect(input).toHaveValue("Nike");
});

it("dispatches a catalog retry from the search error state", () => {
  const { store, dispatch } = renderPage(<SearchPage />, {
    path: ROUTES.search,
    shop: { collections: null, isFetching: false, errorMessage: "Offline" },
  });
  expect(dispatch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(store.getState().shop.isFetching).toBe(true);
});

it("resets purchase state when navigating directly between products", () => {
  const first = SHOP_DATA.jackets.items[0];
  const second = SHOP_DATA.jackets.items[1];
  const { navigate, store } = renderPage(
    <Routes>
      <Route
        path={`${ROUTES.shop}/${ROUTES.productPattern}`}
        element={<ProductDetailPage />}
      />
    </Routes>,
    { path: productPath("jackets", first.id) },
  );
  fireEvent.click(screen.getByRole("button", { name: /increase/i }));
  fireEvent.click(screen.getByRole("button", { name: "Add to bag" }));
  expect(store.getState().cart.cartItems[0].quantity).toBe(2);
  expect(screen.getByText("2 items added to your bag.")).toBeInTheDocument();
  act(() => navigate(productPath("jackets", second.id)));
  expect(
    screen.getByRole("heading", { name: second.name, level: 1 }),
  ).toBeInTheDocument();
  expect(
    screen.queryByText("2 items added to your bag."),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Add 1 to bag" }),
  ).toBeInTheDocument();
});
