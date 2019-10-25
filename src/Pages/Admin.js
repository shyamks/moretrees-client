import AdminOptions from '../components/AdminOptions'
import Header from '../components/Header'
import React, { useEffect } from 'react'
import { PageContent, Page } from '../constants'
import Footer from '../components/Footer'

export function Admin({ staticContext }) {
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
