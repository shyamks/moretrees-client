import Header from '../components/Header'
import UserContext from '../components/UserContext';
import { useContext, useEffect } from 'react'
import React from 'react'
import styled from 'styled-components'

import Error from './NotFound'
import gql from 'graphql-tag';
import useQueryApi from '../components/hooks/useQueryApi';

// import Table from 'rc-table';
import './index.css'
import 'rc-table/assets/index.css';
import { GET_MY_DONATIONS, PageContent, Page } from '../constants';
import Footer from '../components/Footer';
import { useTable } from 'react-table';
import useClient from '../components/hooks/useClient';

const TableRow = styled.div`
    text-align: center;
    vertical-align: middle;
`

const columns = [
    {
        Header: 'Reciept No',
        accessor: 'receiptNo',
        style: { width: '100px' }
    },
    {
        Header: 'Donated Saplings',
        accessor: 'donatedSaplings',
        style: { width: '200px' }
    },
    {
        Header: 'Donated on',
        accessor: 'donatedOn',
        style: { width: '200px' }
    },
    {
        Header: 'Total Amount',
        accessor: 'totalAmount',
        style: { width: '200px' }
    },
];

function getDonationData(donationItems) {
    return donationItems.map(donationItem => {
        const getDonationAmount = (donationAmount, amount) => {
            return (<>
                {donationAmount > 0 && <TableRow>Donated Rs {donationAmount}</TableRow>}
                {amount > 0 && <TableRow>Saplings at Rs {amount}</TableRow>}
            </>)
        }
        const getDonationDate = (createdAt) => {
            let date = new Date(parseInt(createdAt))
            console.log(date, createdAt, 'date')
            return (date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear())
        }
        const getDonatedSaplings = (items) => {
            let rows = items.map(item => {
                let { id, count, saplingName } = item
                let row = <TableRow> {count}x {saplingName}</TableRow>
                return row
            })
            return rows
        }
        console.log(donationItem, 'donationItem')
        let { donationAmount, amount, createdAt, items, id } = donationItem
        let receiptNo = id
        let donatedSaplings = getDonatedSaplings(items)
        let donatedOn = getDonationDate(createdAt)
        let totalAmount = getDonationAmount(donationAmount, amount)
        console.log(donatedSaplings, donatedOn, 'donationData')
        const data = { receiptNo, donatedSaplings, donatedOn, totalAmount }
        return data
    })

}

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

function MyDonations() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);
    let client = useClient()
    let { email } = contextUser || {}
    const [myDonationsData, isGetMyDonationsLoading, isGetMyDonationsError, refetchMyDonationsData] = useQueryApi(gql(GET_MY_DONATIONS), { email })
    console.log(myDonationsData, isGetMyDonationsError, 'data')
    useEffect(() => {
        refetchMyDonationsData()
    }, [])

    // const columns = React.useMemo(
    //     () => [
    //         {
    //             Header: 'First Name',
    //             accessor: 'firstName',
    //         },
    //         {
    //             Header: 'Last Name',
    //             accessor: 'lastName',
    //         },
    //     ],
    //     []
    //   )


    // const data = [
    //     { firstName: 'hello world', lastName: 'hello world2' },
    //     { firstName: 'hello world', lastName: 'hello world2' },
    //     { firstName: 'hello world', lastName: 'hello world2' }
    // ]


    return (
        <Page>
            <Header />
            {client &&
            <PageContent>
                {!contextUser && <Error statusCode={404} />}
                {contextUser && myDonationsData && myDonationsData.myDonations && myDonationsData.myDonations.length > 0 &&
                    <TableContainer>
                        {/* <Table className={'tableWidth'} columns={columns} data={getDonationData(myDonationsData.myDonations)} components={tableComponents} /> */}
                        <Styles>
                            <Table columns={columns} data={getDonationData(myDonationsData.myDonations)}/>
                        </Styles>
                        <Message>
                            Thank You for the Donations.
                        </Message>
                    </TableContainer>
                }
                {contextUser && myDonationsData && myDonationsData.myDonations && myDonationsData.myDonations.length == 0 &&
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
                            console.log(column, headerGroup, column.getHeaderProps(), 'column')
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
                                    // console.log(cell, row, 'cell')
                                    return <td {...cell.getCellProps()}>{cell.value}</td>
                                })}
                            </tr>
                        )
                )}
            </tbody>
        </table>
    )
}

export default MyDonations