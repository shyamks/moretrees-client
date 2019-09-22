import escapeStringRegexp from 'escape-string-regexp'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import Routes from '../../Routes'
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";

import App from '../../App'
import { ServerStyleSheet } from 'styled-components'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { GRAPHQL_ENDPOINT, STORE_TOKEN } from '../../constants'
import { InMemoryCache, HttpLink } from 'apollo-boost'
import initApollo from '../../utils'

// const client = new ApolloClient({
//   link: new HttpLink({
//     uri: GRAPHQL_ENDPOINT
//   }),
//   cache: new InMemoryCache(),
//   ssrMode: true
// })

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
  let html = req.html
  const routerContext = {}
  let client = manageApolloMiddleware()

  console.log(client, 'client')
  const CurrentRoute = Routes.find(route => matchPath(req.baseUrl, route))
  // console.log(CurrentRoute, 'currentRoute')
  let promise
  if (CurrentRoute.loadData) {
    promise = CurrentRoute.loadData()
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
      html = html.replace(
        new RegExp('__' + escapeStringRegexp(key) + '__', 'g'),
        value
      )
    })
    console.log(html, 'html')
    res.send(html)
  }
}

export default renderMiddleware
