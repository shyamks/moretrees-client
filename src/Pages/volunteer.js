import Header from '../components/Header'
import VolunteerChoices from '../components/volunteerChoices'
import React from 'react'
import styled from 'styled-components'
import Footer from '../components/Footer';
import { PageContent } from '../constants';

function Volunteer() {
    return (
        <>
            <Header />
            <PageContent>
                <VolunteerChoices />
            </PageContent>
        </>
    )
}
export default Volunteer