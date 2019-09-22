import React from 'react';
import { Route, Switch } from "react-router-dom";
import { renderRoutes } from 'react-router-config';

import './App.css';
import Routes from './Routes';
import UserContext from './components/UserContext';
import { STORE_TOKEN, STORE_USER } from './constants';

class App extends React.Component {
  state = {
    user: null,
    authToken: null
  };

  setLocalStorageItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    }
    catch (e) {
      console.log(e, 'localStorage error')
    }
  }

  storeUserInContext = (user) => {
    this.setLocalStorageItem(STORE_USER, user);
    if (user.accessToken) {
      this.setLocalStorageItem(STORE_TOKEN, user.accessToken)
      this.setState({ user, authToken: user.accessToken })
    }
    else {
      this.setState({ user });
    }
  };

  removeUserInContext = () => {
    this.setLocalStorageItem(STORE_TOKEN, null)
    this.setLocalStorageItem(STORE_USER, null);
    this.setState({ user: null, authToken: null });
  };

  getUserAndToken = () => {
    try {
      let localStorageUserItem = localStorage.getItem(STORE_USER)
      let localStorageAuthTokenItem = localStorage.getItem(STORE_TOKEN)
      let backupUserItem = localStorageUserItem ? JSON.parse(localStorageUserItem) : null
      let backupAuthItem = localStorageAuthTokenItem ? JSON.parse(localStorageAuthTokenItem) : null
      return [this.state.user || backupUserItem, this.state.authToken || backupAuthItem]
    }
    catch (e) {
      return [this.state.user, this.state.authToken]
    }
  }

  render() {
    const [user, authToken] = this.getUserAndToken()
    let userContextValue = { user, storeUserInContext: this.storeUserInContext, removeUserInContext: this.removeUserInContext, authToken }
    return (
      <UserContext.Provider value={userContextValue}>
        <Switch>
          {renderRoutes(Routes)}
          {/* {Routes.map(route => <Route key={route.name} {...route} />)} */}
        </Switch>
      </UserContext.Provider>
    )
  }

}

export default App;
