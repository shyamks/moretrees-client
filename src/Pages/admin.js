import AdminOptions from '../components/AdminOptions'
import Header from '../components/Header'
import React, { useEffect } from 'react'
import { PageContent, Page } from '../constants'
import Footer from '../components/Footer'

function Donate({ staticContext }) {
    return (
        <>
        <Header />
        <Page>
            <PageContent>
                <AdminOptions/>
            </PageContent>
            <Footer/>
        </Page>
        </>
    )
}

export default Donate