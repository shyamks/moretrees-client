import Header from '../components/Header'
import UserContext from '../components/UserContext';
import { useContext, useEffect } from 'react'
import styled from 'styled-components'

import Error from 'next/error'
import gql from 'graphql-tag';
import useQueryApi from '../components/hooks/useQueryApi';

import Table from 'rc-table';
import 'rc-table/assets/index.css';

const GET_MY_DONATIONS = gql`
    query myDonations($email: String){
        myDonations(email: $email){
            id
            email
            amount
            donationAmount
            items 
            createdAt
            paymentDetails
        }
    }
`
const TableRow = styled.div`
    text-align: center;
    vertical-align: middle;
`
const columns = [
    {
        title: 'Reciept No', dataIndex: 'receiptNo', width: 100,
        render: (value, row, index) => {
            return <TableRow>{value}</TableRow>
        },
    },
    {
        title: 'Donated Saplings', dataIndex: 'donatedSaplings', width: 200,
        render(value, row, index) {
            return <TableRow>{value}</TableRow>;
        },
    },
    {
        title: 'Donated on', dataIndex: 'donatedOn', width: 200,
        render(value, row, index) {
            return <TableRow>{value}</TableRow>;
        },
    },
    {
        title: 'Total Amount', dataIndex: 'totalAmount', width: 200,
        render(value, row, index) {
            return <TableRow>{value}</TableRow>;
        },
    },
];

const BodyRow = styled.tr`
  &:hover {
    background: #d8ffa1 !important;
  }
`;

const HeaderRow = styled.tr`
    text-align: center
`

const tableComponents = {
    header: {
        row: HeaderRow
    },
    body: {
        row: BodyRow,
    },
};


function getDonationData(donationItems) {
    return donationItems.map(donationItem => {
        const getDonationAmount = (donationAmount, amount) => {
            return (<>
                {donationAmount && <TableRow>Donated Rs {donationAmount}</TableRow>}
                {amount && <TableRow>Saplings Rs {amount}</TableRow>}
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
        let { donationAmount, amount, email, createdAt, items, paymentDetails, id } = donationItem
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

function MyDonations() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);

    let { email } = contextUser || {}
    const [myDonationsData, isGetMyDonationsLoading, isGetMyDonationsError, refetchMyDonationsData] = useQueryApi(GET_MY_DONATIONS, { email })

    return (
        <>
            <Header />
            {!contextUser && <Error statusCode={404} />}
            {contextUser && myDonationsData && myDonationsData.myDonations && myDonationsData.myDonations.length > 0 &&
                <>
                    <Table columns={columns} data={getDonationData(myDonationsData.myDonations)} components={tableComponents} />
                    <Message>
                        Thank You for the Donations.
                    </Message>
                </>
            }
            {contextUser && myDonationsData && myDonationsData.myDonations && myDonationsData.myDonations.length == 0 &&
                <Message>
                    You have not made any donations yet.
                </Message>
            }
        </>
    )
}

export default MyDonations