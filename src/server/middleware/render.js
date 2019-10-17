import escapeStringRegexp from 'escape-string-regexp'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import Routes from '../../Routes'
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";

import fs from 'fs';
import path from 'path';

import App from '../../App'
import { ServerStyleSheet } from 'styled-components'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { STORE_TOKEN, FINAL_ENDPOINT } from '../../constants'
import { InMemoryCache } from 'apollo-boost'
// import initApollo from '../../utils'

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

const renderMiddleware = () => (req, res) => {

  const publicPath = path.join(__dirname, '/public');

  fs.readFile(`${publicPath}/app.html`, 'utf8', (err, html) => {
    if (!err) {
      req.html = html;
      let responseHtml = req.html
      let routerContext = {}

      const { NODE_ENV, REACT_APP_PROD_ENDPOINT, REACT_APP_TEST_ENDPOINT } = process.env
      const isProd = NODE_ENV === 'production'
      const FINAL_ENDPOINT = isProd ? REACT_APP_PROD_ENDPOINT : REACT_APP_TEST_ENDPOINT

      const GRAPHQL_ENDPOINT = FINAL_ENDPOINT + '/graphql'
      let client = manageApolloMiddleware(GRAPHQL_ENDPOINT)
      // let { url, baseUrl, originalUrl, _parsedUrl } = req
      // console.log({ url, baseUrl, originalUrl, _parsedUrl }, 'req pls')
      // console.log(JSON.stringify(process.env), 'env server')
      const CurrentRoute = Routes.find(route => matchPath(req.url, route))
      let promise
      if (CurrentRoute.loadData) {
        promise = CurrentRoute.loadData(GRAPHQL_ENDPOINT)
      }
      else {
        promise = Promise.resolve(null)
      }
      if (routerContext.url) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.header('Pragma', 'no-cache')
        res.header('Expires', 0)
        res.redirect(302, routerContext.url)
      } else {
        promise.catch(err => {
          console.error('err promise', GRAPHQL_ENDPOINT, '<=',  err);
          return res.status(500).send('Error getting server data');
        })
        promise.then(data => {
          try {
            routerContext = data ? { data } : {}
            const sheet = new ServerStyleSheet()
            const htmlContent = ReactDOMServer.renderToString(
              <StaticRouter
                location={req.url}
                context={routerContext}
              >
                <ApolloProvider client={client}>
                  <App />
                </ApolloProvider>
              </StaticRouter>
            )
            const htmlReplacements = {
              HTML_CONTENT: htmlContent,
              STYLE_TAGS: sheet.getStyleTags()
            }

            Object.keys(htmlReplacements).forEach(key => {
              const value = htmlReplacements[key]
              responseHtml = responseHtml.replace(
                new RegExp('__' + escapeStringRegexp(key) + '__', 'g'),
                value
              )
            })
            res.send(responseHtml)
          }
          catch (err) {
            console.error('err catch', err);
            return res.status(404)
          }
        })
      }
    } else {
      res.status(500).send('Error parsing app.html');
    }
  });

}

export default renderMiddleware
