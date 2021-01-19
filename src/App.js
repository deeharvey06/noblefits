import React, { Component }from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import HomePage from './pages/homePage/HomePage';
import ShopPage from './pages/shop/ShopPage';
import Header from './components/header/Header'
import SignInAndSignUp from './pages/signinandsignup/SignInAndSignUp';

import { auth } from './firebase/firebase.utils';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
    }
  }

  unsubscribeFromAuth = null;

  componentDidMount() {
    //open subscription
    this.unsubscribeFromAuth = auth.onAuthStateChanged(user => {
      this.setState({ currentUser: user });
    });
  }

  componentWillUnmount() {
    //close subscription
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header currentUser={this.state.currentUser}/>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/shop' component={ShopPage} />
          <Route exact path='/signin' component={SignInAndSignUp} />
        </Switch>
      </div>
    );
  }

}

export default App;