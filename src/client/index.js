import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import './index.css';
import App from '../App';
import { ApolloClient } from 'apollo-client';
import { GRAPHQL_ENDPOINT, STORE_TOKEN } from '../constants';
import { HttpLink, InMemoryCache, ApolloLink } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';

const manageApolloMiddleware = () => {
    const httpLink = createHttpLink({ uri: GRAPHQL_ENDPOINT });
    const middlewareLink = new ApolloLink((operation, forward) => {
        let item
        if (window) item = window.localStorage.getItem(STORE_TOKEN)
        console.log(item, 'items')
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

ReactDOM.hydrate(
    <BrowserRouter>
        <ApolloProvider client={manageApolloMiddleware()}>
            <App />
        </ApolloProvider>
    </BrowserRouter>, document.getElementById('root'));
