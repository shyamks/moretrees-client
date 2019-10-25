import App from './App';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, ApolloLink } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';

import { STORE_TOKEN, isProd } from './constants';

const manageApolloMiddleware = () => {
    console.log(JSON.stringify(process.env),'lets check here env')
    // const { NODE_ENV, RAZZLE_RUNTIME_PROD_ENDPOINT, RAZZLE_RUNTIME_TEST_ENDPOINT } = process.env
    const FINAL_ENDPOINT = isProd ? process.env.RAZZLE_RUNTIME_PROD_ENDPOINT : process.env.RAZZLE_RUNTIME_TEST_ENDPOINT
    const httpLink = createHttpLink({ uri: FINAL_ENDPOINT + '/graphql' });
    const middlewareLink = new ApolloLink((operation, forward) => {
        let item
        if (window) item = window.localStorage.getItem(STORE_TOKEN)
        // console.log(item, 'manageApolloMiddleware')
        const token = item ? JSON.parse(item) : ""
        operation.setContext({
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            }
        });
        return forward(operation);
    })
    const link = middlewareLink.concat(httpLink);
    const client = new ApolloClient({
        link,
        cache: new InMemoryCache(),
        ssrMode: false
    })
    return client
}


hydrate(
  <BrowserRouter>
    <ApolloProvider client={manageApolloMiddleware()}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
