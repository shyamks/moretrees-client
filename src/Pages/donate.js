import DonateItems from '../components/DonateItems'
import Header from '../components/Header'
import React, { useEffect } from 'react'
import { PageContent, Page } from '../constants'
import Footer from '../components/Footer'

export function Donate({ staticContext }) {
    return (
        <Page>
            <Header />
            <PageContent>
                <DonateItems staticContext={staticContext}/>
            </PageContent>
            <Footer/>
        </Page>
    )
}
