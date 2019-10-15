import { FINAL_ENDPOINT, GET_SAPLING_OPTIONS } from "./constants";
const { createApolloFetch } = require('apollo-fetch');

export const loadDataFromServer = (key, env) => {
    // console.log(key, FINAL_ENDPOINT, env, 'env load from server')
    const { NODE_ENV, REACT_APP_GRAPHQL_PROD_ENDPOINT, REACT_APP_GRAPHQL_TEST_ENDPOINT } = env
    const isProd = NODE_ENV == 'production'
    const FINAL_ENDPOINT = isProd ? REACT_APP_GRAPHQL_PROD_ENDPOINT : REACT_APP_GRAPHQL_TEST_ENDPOINT
    const apolloFetch = createApolloFetch({
        uri: FINAL_ENDPOINT
    });
    switch (key) {
        case 'donate':
            return apolloFetch({
                query: (GET_SAPLING_OPTIONS),
                variables: { status: 'ACTIVE' }
            })
        default: 
            return Promise.resolve(null)
    }


}