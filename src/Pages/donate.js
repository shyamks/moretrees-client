import DonateItems from '../components/donateItems'
import Header from '../components/Header'
import React, { useEffect } from 'react'
import { PageContent } from '../constants'

function Donate() {
    return (
        <>
            <Header />
            <PageContent>
                <DonateItems />
            </PageContent>

        </>
    )
}

export default Donate