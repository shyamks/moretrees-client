import React, { useState } from 'react';

import Router from 'next/router'
import styled from 'styled-components'

import Header from '../components/Header'
import Login from '../components/login'
import Register from '../components/register'
import Button from '../components/Button'





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




function MainPage() {
    return (
        <React.Fragment>
            <Header/>
            
            <DonateAndVolunteer>
                <Button height="40px" onClick={() => navigateTo('donate')}>
                    Donate
                </Button>
                <Button height="40px"  width="120px" onClick={() => navigateTo('volunteer')}>
                    Volunteer
                </Button>
            </DonateAndVolunteer>
        </React.Fragment>
    )
}

export default MainPage