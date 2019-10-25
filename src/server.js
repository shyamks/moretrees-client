import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom'
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { ServerStyleSheet } from 'styled-components'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-boost'

import Routes from './Routes'
import App from './App'
import { STORE_TOKEN, isProd } from './constants'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const prepareData = (route, data) => {
  if (route.name === 'reset') {
    if (data && data.data.confirmToken.error){
      console.log(data,'prepareData')
      throw new Error('Reset link has expired. Try again.')
    }
  }
  return data ? { data } : {}
}

const manageApolloMiddleware = (endpoint) => {
  // alert(endpoint,'cmon server')
  const httpLink = createHttpLink({ uri: endpoint });
  const middlewareLink = new ApolloLink((operation, forward) => {
    let item
    if (window) item = window.localStorage.getItem(STORE_TOKEN)
    // console.log(item, 'items')
    const token = item ? JSON.parse(item) : ""
    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
    return forward(operation);
  });

  // use with apollo-client
  const link = middlewareLink.concat(httpLink);
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    ssrMode: true
  })
  return client
}



const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    let context = {};
    const ENDPOINT = isProd ? process.env.RAZZLE_PROD_ENDPOINT : process.env.RAZZLE_TEST_ENDPOINT
    const GRAPHQL_ENDPOINT = `${ENDPOINT}/graphql`
    const client = manageApolloMiddleware(GRAPHQL_ENDPOINT)
    let { url, baseUrl, originalUrl, _parsedUrl, query, params } = req
    // console.log(JSON.stringify({ ...process.env, finalEndpoint: FINAL_ENDPOINT }), 'env server')
    const CurrentRoute = Routes.find(route => matchPath(req._parsedUrl.pathname, route))
    // console.log({ url, baseUrl, originalUrl, _parsedUrl, query, params }, CurrentRoute, 'req pls')

    let promise
    if (CurrentRoute.confirmToken) {
      promise = CurrentRoute.confirmToken(GRAPHQL_ENDPOINT, query['token'])
    }
    else if (CurrentRoute.loadData) {
      promise = CurrentRoute.loadData(GRAPHQL_ENDPOINT)
    }
    else {
      promise = Promise.resolve(null)
    }

    if (context.url) {
      res.redirect(context.url);
    } else {
      promise.catch(err => {
        console.error('err promise', GRAPHQL_ENDPOINT, '<=', err);
        return res.status(500).send('Error getting server data');
      })
      promise.then(data => {
        try {
          context = prepareData(CurrentRoute, data)
          const sheet = new ServerStyleSheet()
          const markup = renderToString(
            <StaticRouter context={context} location={req.url}>
              <ApolloProvider client={client}>
                <App />
              </ApolloProvider>
            </StaticRouter>
          );
          res.status(200).send(
            `<!doctype html>
              <html lang="">
              <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta charset="utf-8" />
                  <title>Welcome to Razzle</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  ${sheet.getStyleTags()}
                  ${
            assets.client.css
              ? `<link rel="stylesheet" href="${assets.client.css}">`
              : ''
            }
                  ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
            }
              </head>
              <body>
                  <div id="root">${markup}</div>
              </body>
          </html>`
          );
        } catch (err) {
          console.error('err catch', err);
          return res.status(404).send(err)
        }
      })
    }
  });

export default server;
