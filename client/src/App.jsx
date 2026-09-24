import { ROUTES } from "@/config/routes";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router";

import RouteAccessibility from "@/components/accessibility/RouteAccessibility";
import BreadcrumbTrail from "@/components/breadcrumbTrail/BreadcrumbTrail";
import ErrorBoundary from "@/components/errorBoundary/errorBoundary";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import Spinner from "@/components/spinner/Spinner";
import {
  selectCurrentUser,
  selectSessionChecked,
} from "@/redux/user/userSelector";
import { lazyWithRetry } from "@/utils/lazyWithRetry";

import "./components/appShell/appShell.scss";

const HomePage = lazyWithRetry(() => import("@/pages/home/Home.jsx"), "home");
const ShopPage = lazyWithRetry(() => import("@/pages/shop/ShopPage"), "shop");
const SignInAndSignUpPage = lazyWithRetry(
  () => import("@/pages/signinandsignup/SignInAndSignUp"),
  "signin",
);
const ForgotPasswordPage = lazyWithRetry(
  () => import("@/pages/forgotPassword/ForgotPasswordPage"),
  "forgot-password",
);
const AccountPage = lazyWithRetry(
  () => import("@/pages/account/AccountPage"),
  "account",
);
const CheckoutPage = lazyWithRetry(
  () => import("@/pages/checkout/Checkout"),
  "checkout",
);
const SearchPage = lazyWithRetry(
  () => import("@/pages/search/SearchPage"),
  "search",
);
const NotFoundPage = lazyWithRetry(
  () => import("@/pages/notFound/NotFoundPage"),
  "not-found",
);

const ProtectedAccountRoute = () => {
  const currentUser = useSelector(selectCurrentUser);
  const sessionChecked = useSelector(selectSessionChecked);

  if (!sessionChecked) return <Spinner />;
  return currentUser ? (
    <AccountPage />
  ) : (
    <Navigate to={ROUTES.signIn} replace />
  );
};

const PublicAuthRoute = ({ children }) => {
  const currentUser = useSelector(selectCurrentUser);
  const sessionChecked = useSelector(selectSessionChecked);

  if (!sessionChecked) return <Spinner />;
  return currentUser ? <Navigate to={ROUTES.account} replace /> : children;
};

const App = () => {
  const location = useLocation();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <RouteAccessibility />
      <Header />

      <main id="main-content" className="app-main" tabIndex="-1">
        <div className="app-content">
          <BreadcrumbTrail />
          <ErrorBoundary resetKey={location.pathname}>
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path={ROUTES.home} element={<HomePage />} />
                <Route path={ROUTES.shopRoot} element={<ShopPage />} />
                <Route path={ROUTES.checkout} element={<CheckoutPage />} />
                <Route path={ROUTES.search} element={<SearchPage />} />
                <Route
                  path={ROUTES.account}
                  element={<ProtectedAccountRoute />}
                />
                <Route
                  path={ROUTES.signIn}
                  element={
                    <PublicAuthRoute>
                      <SignInAndSignUpPage />
                    </PublicAuthRoute>
                  }
                />
                <Route
                  path={ROUTES.forgotPassword}
                  element={
                    <PublicAuthRoute>
                      <ForgotPasswordPage />
                    </PublicAuthRoute>
                  }
                />
                <Route path={ROUTES.notFound} element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
