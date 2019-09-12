import React from 'react';

import Router from 'next/router'
import styled from 'styled-components'

import SiteHeader from '../components/Header'
import ResponsiveImage from '../components/ResponsiveImage';


const bannerImage = '/static/images/moretrees-back.jpg'
const volunteerImage = '/static/images/volunteer.jpg'
const donateImage = '/static/images/donate.jpg'
const buyPlantsImage = '/static/images/buy-plants.jpg'


const DonateAndVol = styled.div`
    margin-top: 20px
    display: flex;
    flex-direction: row;
    justify-content: space-around;
`

const ImageContainer = styled.div`
`

const Donate = styled.div`
    margin: 10px;
    &: hover{
        cursor: pointer;
    }
`

const Volunteer = styled.div`
    margin: 10px;
    &: hover{
        cursor: pointer;
    }
`

const navigateTo = (page, params) => {
    Router.push({
        pathname: `/${page}`
        // query: { name: 'Zeit' },
    })
}

const Image = styled.img`
    width: 80%;
    height: auto;
`

const onNewUserRegistration = () => {
    NotificationManager.success('Success message', 'New User Registered');
}

function MainPage() {
    return (
        <>
            <SiteHeader navigate={(page) => navigateTo(page)} onRegistered={onNewUserRegistration} />
            <ImageContainer>
                <ResponsiveImage
                    src={bannerImage}
                // width={400}
                // height={300} 
                />
            </ImageContainer>
            <DonateAndVol>
                <Donate onClick={() => navigateTo('donate')}>
                    <Image src={donateImage} />

                </Donate>
                <Volunteer onClick={() => navigateTo('volunteer')}>
                    <Image src={volunteerImage} />

                </Volunteer>
            </DonateAndVol>
        </>
    )
}

export default MainPage