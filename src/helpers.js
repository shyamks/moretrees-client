import { FINAL_ENDPOINT, GET_PROJECTS, CONFIRM_TOKEN_QUERY } from "./constants";
const { createApolloFetch } = require('apollo-fetch');

export const loadDataFromServer = (key, endpoint) => {
    
    const apolloFetch = createApolloFetch({
        uri: endpoint
    });
    switch (key) {
        case 'donate':
            return apolloFetch({
                query: (GET_PROJECTS),
                variables: { status: 'ACTIVE' }
            })
        default: 
            return Promise.resolve(null)
    }


}

export const getEmailFromToken = (endpoint, token) => {
    try {
        const apolloFetch = createApolloFetch({
            uri: endpoint
        });
        return apolloFetch({
            query: CONFIRM_TOKEN_QUERY,
            variables: { token }
        })
    }
    catch (e) {
        console.log(e, 'error')
    }
}