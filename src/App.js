import React from 'react';
import { Route, Switch } from "react-router-dom";
import { renderRoutes } from 'react-router-config';

import './App.css';
import Routes from './Routes';
import UserContext from './components/UserContext';
import { STORE_TOKEN, STORE_USER } from './constants';
import Logger from './components/Logger';

class App extends React.Component {
  state = {
    user: null,
    authToken: null,
    callRegisterModal: false
  };

  setLocalStorageItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    }
    catch (e) {
      Logger(e, 'localStorage error')
    }
  };

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

  getAppState = () => {
    let {user, authToken, callRegisterModal} = this.state
    try {
      let localStorageUserItem = localStorage.getItem(STORE_USER)
      let localStorageAuthTokenItem = localStorage.getItem(STORE_TOKEN)
      let backupUserItem = localStorageUserItem ? JSON.parse(localStorageUserItem) : null
      let backupAuthItem = localStorageAuthTokenItem ? JSON.parse(localStorageAuthTokenItem) : null
      return [user || backupUserItem, authToken || backupAuthItem, callRegisterModal]
    }
    catch (e) {
      return [user, authToken, callRegisterModal]
    }
  };

  setRegisterModal = (value) => {
    this.setState({ callRegisterModal: value })
  };

  render() {
    const [user, authToken, callRegisterModal] = this.getAppState()
    let userContextValue = { user, storeUserInContext: this.storeUserInContext, removeUserInContext: this.removeUserInContext, authToken, callRegisterModal, setRegisterModal: this.setRegisterModal }
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
