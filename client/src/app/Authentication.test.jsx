import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import createSagaMiddleware from "redux-saga";
import App from "@/App";
import { authApi } from "@/api/authApi";
import { userSagas } from "@/redux/user/sagas";
import { cartSagas } from "@/redux/cart/sagas";
import userReducer from "@/redux/user/userReducer";
import cartReducer from "@/redux/cart/cartReducer";
import shopReducer from "@/redux/shop/shopReducer";
import directoryReducer from "@/redux/directory/directoryReducer";
import {
  checkUserSession,
  sessionCheckComplete,
  signInSuccess,
} from "@/redux/user/actions";
import { addItem } from "@/redux/cart/actions";
import SHOP_DATA from "@/redux/shop/shopData";
import { ROUTES } from "@/config/routes";

jest.mock("@/api/authApi", () => ({
  authApi: {
    getSession: jest.fn(),
    signInWithEmail: jest.fn(),
    signInWithGoogle: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPassword: jest.fn(),
  },
}));
const profile = {
  id: "user-1",
  displayName: "Alex",
  email: "alex@example.com",
  createdAt: "2025-01-01",
};
const tasks = [];
let scrollSpy;
beforeEach(() => {
  scrollSpy = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
  Object.values(authApi).forEach((mock) => mock.mockReset());
});
afterEach(() => {
  tasks.splice(0).forEach((task) => task.cancel());
  scrollSpy.mockRestore();
});

const renderApp = (path, { signedIn = false, restoring = false } = {}) => {
  const saga = createSagaMiddleware();
  const store = configureStore({
    reducer: {
      user: userReducer,
      cart: cartReducer,
      shop: shopReducer,
      directory: directoryReducer,
    },
    middleware: (getDefault) => getDefault().concat(saga),
    preloadedState: {
      shop: { collections: SHOP_DATA, isFetching: false, errorMessage: "" },
    },
  });
  tasks.push(saga.run(userSagas), saga.run(cartSagas));
  if (signedIn) store.dispatch(signInSuccess(profile));
  else if (!restoring) store.dispatch(sessionCheckComplete());
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>,
  );
  return store;
};

it("waits for session restoration before admitting an authenticated user", async () => {
  let resolveSession;
  authApi.getSession.mockImplementation(
    () =>
      new Promise((resolve) => {
        resolveSession = resolve;
      }),
  );
  const store = renderApp(ROUTES.account, { restoring: true });
  act(() => store.dispatch(checkUserSession()));
  expect(
    screen.queryByRole("heading", { name: /Welcome, Alex/ }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Sign in to Noble Fits" }),
  ).not.toBeInTheDocument();
  await act(async () => {
    resolveSession(profile);
  });
  expect(
    await screen.findByRole("heading", { name: "Welcome, Alex." }),
  ).toBeInTheDocument();
});

it("redirects anonymous users to sign in and completes email sign-in through the saga", async () => {
  authApi.signInWithEmail.mockResolvedValue(profile);
  renderApp(ROUTES.account);
  await screen.findByRole("heading", { name: "Sign in to Noble Fits" });
  fireEvent.change(screen.getByLabelText(/Email address/), {
    target: { value: " alex@example.com " },
  });
  fireEvent.change(screen.getByLabelText(/^Password/), {
    target: { value: "test-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  expect(
    await screen.findByRole("heading", { name: "Welcome, Alex." }),
  ).toBeInTheDocument();
  expect(authApi.signInWithEmail).toHaveBeenCalledWith(
    "alex@example.com",
    "test-password",
  );
});

it("shows a controlled sign-in failure and clears it when the credentials change", async () => {
  authApi.signInWithEmail.mockRejectedValue({
    code: "auth/invalid-credential",
    message: "private vendor diagnostics",
  });
  renderApp(ROUTES.signIn);
  await screen.findByRole("heading", { name: "Sign in to Noble Fits" });
  fireEvent.change(screen.getByLabelText(/Email address/), {
    target: { value: "alex@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^Password/), {
    target: { value: "wrong-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    /could not sign you in/i,
  );
  expect(
    screen.queryByText("private vendor diagnostics"),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/^Password/), {
    target: { value: "corrected-password" },
  });
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("creates an account and stores only the returned application profile", async () => {
  authApi.signUp.mockResolvedValue(profile);
  const store = renderApp(`${ROUTES.signIn}?mode=register`);
  await screen.findByRole("heading", { name: "Create your account" });
  fireEvent.change(screen.getByLabelText(/Display name/), {
    target: { value: " Alex " },
  });
  fireEvent.change(screen.getByLabelText(/Email address/), {
    target: { value: "alex@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/^Password/), {
    target: { value: "test-password" },
  });
  fireEvent.change(screen.getByLabelText(/Confirm password/), {
    target: { value: "test-password" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));
  expect(
    await screen.findByRole("heading", { name: "Welcome, Alex." }),
  ).toBeInTheDocument();
  expect(authApi.signUp).toHaveBeenCalledWith({
    displayName: "Alex",
    email: "alex@example.com",
    password: "test-password",
  });
  expect(store.getState().user.currentUser).toEqual(profile);
});

it("keeps the user and bag on sign-out failure, then clears both on success", async () => {
  authApi.signOut
    .mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValueOnce(undefined);
  const store = renderApp(ROUTES.account, { signedIn: true });
  act(() => store.dispatch(addItem(SHOP_DATA.hats.items[0])));
  await screen.findByRole("heading", { name: "Welcome, Alex." });
  const main = within(screen.getByRole("main"));
  fireEvent.click(main.getByRole("button", { name: /Sign out/ }));
  await waitFor(() =>
    expect(store.getState().user.errorContext).toBe("sign-out"),
  );
  expect(store.getState().cart.cartItems).toHaveLength(1);
  expect(store.getState().user.currentUser).toEqual(profile);
  fireEvent.click(main.getByRole("button", { name: /Sign out/ }));
  await screen.findByRole("heading", { name: "Sign in to Noble Fits" });
  expect(store.getState().cart.cartItems).toHaveLength(0);
  expect(store.getState().user.currentUser).toBeNull();
});

it("recovers from an unavailable session service without leaving a permanent spinner", async () => {
  authApi.getSession.mockRejectedValue(new Error("Offline"));
  const store = renderApp(ROUTES.account, { restoring: true });
  act(() => store.dispatch(checkUserSession()));
  expect(
    await screen.findByRole("heading", { name: "Sign in to Noble Fits" }),
  ).toBeInTheDocument();
  expect(store.getState().user.sessionChecked).toBe(true);
});

it("redirects signed-in users away from the public authentication form", async () => {
  renderApp(ROUTES.signIn, { signedIn: true });
  expect(
    await screen.findByRole("heading", { name: "Welcome, Alex." }),
  ).toBeInTheDocument();
});
