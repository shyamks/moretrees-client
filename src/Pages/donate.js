import DonateItems from '../components/DonateItems'
import Header from '../components/Header'
import React, { useEffect } from 'react'
import { PageContent } from '../constants'
import Footer from '../components/Footer'

function Donate() {
    return (
        <>
            <Header />
            <PageContent>
                <DonateItems />
            </PageContent>

            <Footer/>

        </>
    )
}

export default Donate