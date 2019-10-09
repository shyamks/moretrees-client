import DonateItems from '../components/DonateItems'
import Header from '../components/Header'
import React, { useEffect } from 'react'
import { PageContent, Page } from '../constants'
import Footer from '../components/Footer'

function Donate() {
    return (
        <Page>
            <Header />
            <PageContent>
                <DonateItems />
            </PageContent>
            <Footer/>
        </Page>
    )
}

export default Donate