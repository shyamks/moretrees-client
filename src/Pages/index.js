import React from 'react';
import styled from 'styled-components'

import SiteHeader from '../components/Header'
import { withRouter } from "react-router-dom";

import './index.css'
import bannerImage from '../images/moretrees-back.jpg'
import volunteerImage from '../images/volunteer.jpg'
import donateImage from '../images/donate.jpg'
import buyPlantsImage from '../images/buy-plants.jpg'
import Footer from '../components/Footer';


const PageContent = styled.div`
    margin-top: 90px;
    width: 100%;
    height: auto;
`
const DonateAndVol = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 20px
`

const ImageContainer = styled.div`
    background-size: cover;
    width: 100%;
    min-height: 200px;
    @media screen and (min-width: 1000px) {
        margin-top: 30px;
    }
    @media screen and (min-width: 650px) {
        margin-top: 90px;
    }
    @media screen and (max-width: 650px) {
        margin-top: 90px;
    }
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



const Image = styled.img`
    width: 200px;
    height: auto;
    @media screen and (max-width: 450px) {
        width: 150px;
    }
`

const Imager = styled.img`
    min-height: 200px;
    width: 100%;
`

const onNewUserRegistration = () => {
    // NotificationManager.success('Success message', 'New User Registered');
}

function MainPage({ history }) {
    const navigateTo = (path) => {
        history.push(path)
    }
    console.log(history, 'his')
    return (
        <>
            <SiteHeader onRegistered={onNewUserRegistration} />
            <PageContent>
                <ImageContainer>
                    <Imager src={bannerImage} />
                </ImageContainer>

                <DonateAndVol>
                    <Donate onClick={() => navigateTo('donate')}>
                        <Image src={donateImage} />
                    </Donate>
                    <Volunteer onClick={() => navigateTo('volunteer')}>
                        <Image src={volunteerImage} />
                    </Volunteer>
                </DonateAndVol>
            </PageContent>
            <Footer/>
        </>
    )
}

export default withRouter(MainPage)