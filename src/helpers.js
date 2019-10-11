import { GET_MY_DONATIONS, GET_USER_QUERY, FINAL_ENDPOINT, GET_SAPLING_OPTIONS } from "./constants";
import gql from "graphql-tag";
const { createApolloFetch } = require('apollo-fetch');

const apolloFetch = createApolloFetch({
    uri: FINAL_ENDPOINT
});

export const loadDataFromServer = (key, data) => {
    switch (key) {
        case 'countries':
            return fetch(FINAL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: GET_MY_DONATIONS }),
            }).then(res => res.json())

        case 'donate':
            return apolloFetch({
                query: gql(GET_SAPLING_OPTIONS),
                variables: { status: 'ACTIVE' }
            }).then(res => {
                console.log(res,'res')
                return res.json()
            })
        default: 
            return Promise.resolve(null)
    }


}