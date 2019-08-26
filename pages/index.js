import React, { useState } from 'react';

import Router from 'next/router'
import styled from 'styled-components'

import Header from '../components/Header'
import Login from '../components/login'
import Register from '../components/register'
import Button from '../components/Button'

import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-client';

import { GRAPHQL_ENDPOINT } from '../constants';

// const client = new ApolloClient({
//     link: createHttpLink({
//       uri: GRAPHQL_ENDPOINT,
//       fetch: fetch,
//     }),
//     cache: new InMemoryCache(),
//   })

const DonateAndVolunteer = styled.div`
    margin: 10%;
    display: flex;
    flex-direction: horizontal;
    justify-content: space-around;
`

const navigateTo = (page, params) => {
    Router.push({
        pathname: `/${page}`
        // query: { name: 'Zeit' },
    })
}

const onNewUserRegistration = () => {
    NotificationManager.success('Success message', 'New User Registered');
}



function MainPage() {
    return (

        <div>
            <Header onRegistered={onNewUserRegistration} />

            <DonateAndVolunteer>
                <Button height="40px" onClick={() => navigateTo('donate')}>
                    Donate
                </Button>
                <Button height="40px" width="120px" onClick={() => navigateTo('volunteer')}>
                    Volunteer
                </Button>
            </DonateAndVolunteer>
        </div>
    )
}

export default MainPage