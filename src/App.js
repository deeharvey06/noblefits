import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import HomePage from './pages/homePage/HomePage';
import ShopPage from './pages/shop/ShopPage';
import Header from './components/header/Header'
import SignInAndSignUp from './pages/signinandsignup/SignInAndSignUp';

function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/shop' component={ShopPage} />
        <Route exact path='/signin' component={SignInAndSignUp} />
      </Switch>
    </div>
  );
}

export default App;