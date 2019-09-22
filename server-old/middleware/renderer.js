import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Loadable from 'react-loadable';
import { StaticRouter, matchPath } from "react-router";
import serialize from 'serialize-javascript';
import { loadDataFromServer } from '../../src/helpers'
// read the manifest file
import manifest from '../../build/public/asset-manifest.json';

// function to map chunk names to assets
const extractAssets = (assets, chunks) => Object.keys(assets)
    .filter(asset => chunks.indexOf(asset.replace('.js', '')) > -1)
    .map(k => assets[k]);

// import our main App component
import App from '../../src/App';
import Routes from '../../src/Routes';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { GRAPHQL_ENDPOINT } from '../../src/constants'
import { HttpLink, InMemoryCache } from 'apollo-boost';

const client = new ApolloClient({
    link: new HttpLink({
        uri: GRAPHQL_ENDPOINT
    }),
    cache: new InMemoryCache(),
    ssrMode: true
});


const path = require("path");
const fs = require("fs");

const func = (req, res, next) => {

    const filePath = path.resolve(__dirname, '..', '..', 'build', 'index.html');

    const CurrentRoute = Routes.find(route => matchPath(req.baseUrl, route))
    let promise
    if (CurrentRoute.loadData) {
        promise = CurrentRoute.loadData(req.params)
    }
    else {
        promise = Promise.resolve(null)
    }

    promise.catch(err => {
        console.error('err', err);
        return res.status(404)
    })
    promise.then(data => {
        const context = { data }
        let html
        try {
            html = ReactDOMServer.renderToString(
                <StaticRouter location={req.baseUrl} context={context}>
                    <ApolloProvider client={client}>
                        <App />
                    </ApolloProvider>
                </StaticRouter>
            );
        }
        catch (e) {
            console.log(e,'eeroor')
            return res.status(404).end()
        }
        fs.readFile(filePath, 'utf8', (err, htmlData) => {
            if (err) {
                console.error('err', err);
                return res.status(404).end()
            }

            const modules = [];
            const extraChunks = extractAssets(manifest, modules)
                .map(c => `<script type="text/javascript" src="/${c}"></script>`);

            // now inject the rendered app into our html and send it
            let finalHtml = htmlData.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
                .replace('</body>', `<script>window.__ROUTE_DATA__ = ${serialize(data)}</script>` + extraChunks.join('') + `</body>`)
            // console.log(finalHtml,'final')
            return res.send(finalHtml);
        });

    })

}

module.exports = func