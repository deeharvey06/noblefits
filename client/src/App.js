import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import Header from "./components/header/Header";
import Spinner from './components/spinner/Spinner';
import ErrorBoundary from "./components/errorBoundary/errorBoundary"

import { GlobalStyle } from './global.styles';

import { selectCurrentUser } from "./redux/user/userSelector";
import { checkUserSession } from "./redux/user/actions"

const HomePage = lazy(() => import("./pages/home/Home.js"));
const ShopPage = lazy(() => import("./pages/shop/ShopPage"));
const SignInAndSignUpPage = lazy(() => import("./pages/signinandsignup/SignInAndSignUp"));
const CheckoutPage = lazy(() => import( "./pages/checkout/Checkout"));


const App = ({ checkUserSession, currentUser }) => {
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  return (
    <div>
      <GlobalStyle />
      <Header />
      <Switch>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Route exact path='/' component={HomePage} />
            <Route path='/shop' component={ShopPage} />
            <Route exact path='/checkout' component={CheckoutPage} />
            <Route
              exact
              path='/signin'
              render={() =>
                currentUser ? <Redirect to='/' /> : <SignInAndSignUpPage />
              }
            />
          </Suspense>
        </ErrorBoundary>
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
