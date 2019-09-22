import { GRAPHQL_ENDPOINT, GET_MY_DONATIONS, GET_USER_QUERY } from "./constants";
import gql from "graphql-tag";
const { createApolloFetch } = require('apollo-fetch');

const apolloFetch = createApolloFetch({
    uri: GRAPHQL_ENDPOINT
});

export const loadDataFromServer = (key, data) => {
    switch (key) {
        case 'countries':
            return fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: GET_MY_DONATIONS }),
            }).then(res => res.json())

        case 'country':
            return apolloFetch({
                query: gql(GET_USER_QUERY),
                variables: { countryCode: data }
            }).then(res => res.json())
        default: 
            return Promise.resolve(null)
    }


}