import App, { Container } from "next/app"
import React from "react"
import withApolloClient from "../lib/with-apollo-client"
import { ApolloProvider } from "@apollo/react-hooks"
import UserContext from '../components/UserContext'
import { STORE_TOKEN, STORE_USER } from "../constants";

class MyApp extends App {
  state = {
    user: null,
    authToken: null
  };

  setLocalStorageItem = (key, value) =>{
    localStorage.setItem(key, JSON.stringify(value))
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
    const { Component, pageProps, apolloClient } = this.props
    const [user, authToken] = this.getUserAndToken()
    let userContextValue = { user, storeUserInContext: this.storeUserInContext, removeUserInContext: this.removeUserInContext, authToken }
    return (
      <Container>
        <UserContext.Provider value={userContextValue}>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </UserContext.Provider>

      </Container>
    )
  }
}

export default withApolloClient(MyApp)