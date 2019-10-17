import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';

import './index.css';
import App from '../App';
import { ApolloClient } from 'apollo-client';
import { STORE_TOKEN } from '../constants';
import { InMemoryCache, ApolloLink } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import Logger from '../components/Logger';

const manageApolloMiddleware = () => {
    console.log(JSON.stringify(process.env),'lets check here env')
    const { NODE_ENV, REACT_APP_PROD_ENDPOINT, REACT_APP_TEST_ENDPOINT } = process.env
    const isProd = NODE_ENV === 'production'
    const FINAL_ENDPOINT = isProd ? REACT_APP_PROD_ENDPOINT : REACT_APP_TEST_ENDPOINT
    const httpLink = createHttpLink({ uri: FINAL_ENDPOINT + '/graphql' });
    const middlewareLink = new ApolloLink((operation, forward) => {
        let item
        if (window) item = window.localStorage.getItem(STORE_TOKEN)
        console.log(item, 'manageApolloMiddleware')
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
