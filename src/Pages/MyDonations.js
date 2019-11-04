import Header from '../components/Header'
import UserContext from '../components/UserContext';
import { useContext, useEffect } from 'react'
import React from 'react'
import styled from 'styled-components'

import NotFound from './NotFound'
import gql from 'graphql-tag';
import useQueryApi from '../components/hooks/useQueryApi';

import { GET_MY_DONATIONS, PageContent, Page, TREE_STATUS, RESPONSE_SUCCESS } from '../constants';
import Footer from '../components/Footer';
import { useTable } from 'react-table';
import useClient from '../components/hooks/useClient';
import Logger from '../components/Logger';
import { MyTree } from '../components/MyTree';

const TableRow = styled.div`
    text-align: center;
    vertical-align: middle;
`

const Message = styled.div`
    text-align: center;
    vertical-align: middle;
    margin-top: 20px;
`

const TableContainer = styled.div`
    display: inline-block;
`

const Styles = styled.div`
  padding: 1rem;
  
  table {
    max-width: 960px;
    margin: 10px auto;
  }
  
  caption {
    font-size: 1.6em;
    font-weight: 400;
    padding: 10px 0;
  }
  
  thead th {
    font-weight: 400;
    background: #8a97a0;
    color: #FFF;
  }
  
  tr {
    background: #f4f7f8;
    border-bottom: 1px solid #FFF;
    margin-bottom: 5px;
  }
  
  tr:nth-child(even) {
    background: #e8eeef;
  }
  
  th, td {
    text-align: left;
    padding: 20px;
    font-weight: 300;
  }
  
  tfoot tr {
    background: none;
  }
  
  tfoot td {
    padding: 10px 2px;
    font-size: 0.8em;
    font-style: italic;
    color: #8a97a0;
  }
`

export function MyDonations() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);
    let client = useClient()
    let { email, twitterId, instaId } = contextUser || {}
    const [myDonationsData, isGetMyDonationsLoading, isGetMyDonationsError,
         refetchMyDonationsData] = useQueryApi(gql(GET_MY_DONATIONS), { email, twitterId, instaId })
    useEffect(() => {
        refetchMyDonationsData()
    }, [])

    let myDonations, plantedTrees = [], pendingCount = 0
    if (myDonationsData && myDonationsData.myDonations.responseStatus.status === RESPONSE_SUCCESS && myDonationsData.myDonations.myDonations.length > 0) {
        myDonations = myDonationsData.myDonations.myDonations
        pendingCount = 0
        plantedTrees = myDonations.reduce((array, tree) => {
            if (tree.status === TREE_STATUS.PENDING){
                pendingCount++
            }
            else if (tree.status === TREE_STATUS.PLANTED){
                array = [...array, <MyTree key={tree.treeId} myDonation={tree}/>]
            }
            else{
                array = [...array, (<div></div>)]
            }
            return array
        }, [])
        console.log('here', pendingCount)
    }
    console.log(myDonationsData,'pendingCount')
    return (
        <Page>
            <Header />
            {client &&
            <PageContent>
                {!contextUser && <NotFound statusCode={404} />}
                {contextUser && myDonations &&
                    (pendingCount &&
                        <>
                            <Message> Thanks for your Donation. There are {pendingCount} saplings yet to be planted. We 'll let you know when they are. Cheers!</Message>
                            {plantedTrees}
                        </>
                    )
                }
                {contextUser && myDonationsData && myDonationsData.myDonations.myDonations && myDonationsData.myDonations.myDonations.length == 0 &&
                    <Message>
                        You have not made any donations yet.
                    </Message>
                }
            </PageContent>}
            <Footer/>
        </Page>
    )
}

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })
    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => {
                            Logger(column, headerGroup, column.getHeaderProps(), 'column')
                            return (
                                <th {...column.getHeaderProps()} style={column.style}>{column.render('Header')}</th>
                            )
                        })}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(
                    (row, i) =>
                        prepareRow(row) || (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    // Logger(cell, row, 'cell')
                                    return <td {...cell.getCellProps()}>{cell.value}</td>
                                })}
                            </tr>
                        )
                )}
            </tbody>
        </table>
    )
}
