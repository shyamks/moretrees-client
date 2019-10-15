import { FINAL_ENDPOINT, GET_SAPLING_OPTIONS } from "./constants";
const { createApolloFetch } = require('apollo-fetch');

export const loadDataFromServer = (key, endpoint) => {
    
    const apolloFetch = createApolloFetch({
        uri: endpoint
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