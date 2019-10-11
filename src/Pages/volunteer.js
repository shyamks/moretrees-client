import Header from '../components/Header'
import VolunteerChoices from '../components/volunteerChoices'
import React from 'react'
import styled from 'styled-components'
import Footer from '../components/Footer';
import { PageContent, Page } from '../constants';

function Volunteer() {
    return (
        <Page>
            <Header />
            <PageContent>
                <VolunteerChoices />
            </PageContent>
            <Footer />
        </Page>
    )
}
export default Volunteer