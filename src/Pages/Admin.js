import React, { useEffect } from 'react'

import styled from 'styled-components'
import AdminOptions from '../components/AdminOptions'
import Header from '../components/Header'
import { PageContent, Page } from '../constants'
import Footer from '../components/Footer'

const AdminContent = styled.div`
    margin-top: 70px;
    padding-bottom: 13rem;
`
export function Admin({ staticContext }) {
    return (
        <>
        <Header />
        <Page>
            <AdminContent>
                <AdminOptions/>
            </AdminContent>
            <Footer/>
        </Page>
        </>
    )
}
