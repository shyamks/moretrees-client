import React, { useState } from 'react';

import Router from 'next/router'
import styled from 'styled-components'
// import { toast } from 'react-toastify'

import Header from '../components/Header'
import Login from '../components/login'
import Register from '../components/register'
import Button from '../components/Button'
import Footer from '../components/Footer';


const treeImage = '/static/images/noah-buscher-x8ZStukS2PM-unsplash.jpg'

const BannerOfTrees = styled.main`
    display: flex;
    height: 100%;
    background-image: url('${treeImage}');
    background-repeat: no-repeat;
    background-size: 100% 90%;
`

const DonateAndVol = styled.div`
    width: 100%;
    margin: 35% auto 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`

const Image = styled.img`
  height: 100px;
  width: 100px;
`;

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
        <>
            <Header onRegistered={onNewUserRegistration} />
            <BannerOfTrees>
                <DonateAndVol>
                    <Button height="50px" width="150px" onClick={() => navigateTo('donate')}>
                        Donate
                    </Button>
                    <Button height="50px" width="150px" onClick={() => navigateTo('volunteer')}>
                        Volunteer
                    </Button>
                </DonateAndVol>
            </BannerOfTrees>
        </>
    )
}

export default MainPage