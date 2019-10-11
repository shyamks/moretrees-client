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
import { STORE_TOKEN, FINAL_ENDPOINT } from '../../constants'
import { InMemoryCache } from 'apollo-boost'
// import initApollo from '../../utils'

const manageApolloMiddleware = () => {
  const httpLink = createHttpLink({ uri: FINAL_ENDPOINT });
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
  let html = req.html
  let routerContext = {}
  let client = manageApolloMiddleware()
  // let { url, baseUrl, originalUrl, _parsedUrl } = req
  // console.log({ url, baseUrl, originalUrl, _parsedUrl }, 'req pls')
  const CurrentRoute = Routes.find(route => matchPath(req.url, route))
  // console.log(CurrentRoute, 'currentRoute')
  let promise
  if (CurrentRoute.loadData) {
    promise = CurrentRoute.loadData()
    // promise = Promise.resolve(null)
  }
  else {
    promise = Promise.resolve(null)
  }
  // console.log(promise,'promise here')
  if (routerContext.url) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.header('Pragma', 'no-cache')
    res.header('Expires', 0)
    res.redirect(302, routerContext.url)
  } else {
    promise.catch(err => {
      console.error('err promise', err);
      return res.status(404)
    })
    promise.then(data => {
      try {
        routerContext = { data }
        console.log(data, 'promiseData')
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
        res.send(html)
      }
      catch (err) {
        console.error('err catch', err);
        return res.status(404)
      }
    })
  }

}

export default renderMiddleware
