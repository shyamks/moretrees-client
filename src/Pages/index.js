import React from 'react';
import styled from 'styled-components'

import SiteHeader from '../components/Header'
import { withRouter } from "react-router-dom";

import bannerImage from '../images/moretrees-back.jpg'
import volunteerImage from '../images/volunteer.jpg'
import donateImage from '../images/donate.jpg'
import donateIcon from '../images/donate_icon.png'
import volunteerIcon from '../images/volunteer_icon_2.png'
import buyPlantsImage from '../images/buy-plants.jpg'
import Footer from '../components/Footer';
import { Page, PageContent } from '../constants';
import { isClickOrEnter } from '../utils';


const DonateAndVol = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 20px
`

const ImageContainer = styled.div`
    background-size: cover;
    width: 100%;
    min-height: 150px;
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

const BigButton = styled.div`
    margin: 10px;
    outline: none;
    display: flex;
    flex-direction: row;
    &: hover{
        cursor: pointer;
    }
`

const Volunteer = styled.div`
    margin: 10px;
    outline: none;
    &: hover{
        cursor: pointer;
    }
`

const DonateImage = styled.img`
    width: 60px;
    height: 60px;
    @media screen and (max-width: 450px) {
        width: 30px;
    }
`

const VolunteerImage = styled.img`
    width: 50px;
    height: 45px;
    @media screen and (max-width: 450px) {
        width: 30px;
    }
`

const ImageContent = styled.div`
    margin: 0 0 0 8px;
    width: 100px;
`
const ImageHeaderText = styled.p`
    font-weight: bold;
    font-size: 22px;
    margin: 0;
`
const ImageText = styled.p`
    font-size: 16px;
    margin: 0;
`

const BannerImage = styled.img`
    min-height: 150px;
    width: 100%;
`
const DonateHeaderText = 'Donate'
const DonateText = 'we will plant trees around you'

const VolunteerHeaderText = 'Volunteer'
const VolunteerText = 'help us plant more trees'

const onNewUserRegistration = () => {
    // NotificationManager.success('Success message', 'New User Registered');
}

function MainPage({ history }) {
    const navigateTo = (e, path) => {
        if (isClickOrEnter(e))
            history.push(path)
    }
    return (
        <Page>
            <SiteHeader onRegistered={onNewUserRegistration} />
            <PageContent>
                <ImageContainer>
                    <BannerImage src={bannerImage} />
                </ImageContainer>

                <DonateAndVol>
                    <BigButton tabIndex="0" onKeyPress={(e) => navigateTo(e, 'donate')} onClick={(e) => navigateTo(e, 'donate')}>
                        <DonateImage src={donateIcon} />
                        <ImageContent>
                            <ImageHeaderText>{DonateHeaderText}</ImageHeaderText>
                            <ImageText>{DonateText}</ImageText>
                        </ImageContent>
                    </BigButton>
                    <BigButton tabIndex="0" onKeyPress={(e) => navigateTo(e, 'donate')} onClick={(e) => navigateTo(e, 'volunteer')}>
                        <VolunteerImage src={volunteerIcon} />
                        <ImageContent>
                            <ImageHeaderText>{VolunteerHeaderText}</ImageHeaderText>
                            <ImageText>{VolunteerText}</ImageText>
                        </ImageContent>
                    </BigButton>
                </DonateAndVol>
            </PageContent>
            <Footer/>
        </Page>
    )
}

export default withRouter(MainPage)