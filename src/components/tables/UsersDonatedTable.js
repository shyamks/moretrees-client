import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect } from 'react'
import lodash from 'lodash'

import { GET_ALL_USER_DONATIONS, UPDATE_USERS_MUTATION, } from '../../constants';

import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import useQueryApi from '../hooks/useQueryApi'
import gql from 'graphql-tag'
import useMutationApi from '../hooks/useMutationApi';
import Button from '../Button';
import { showToast, convertNullToEmptyString } from '../../utils';
import UserContext from '../UserContext';
import Logger from '../Logger';

const columns = [
    { dataField: 'createdAt', text: 'CreatedAt', sort: true, editable: false },
    { dataField: 'email', text: 'Email', sort: true, editable: false },
    { dataField: 'amount', text: 'Amount', editable: false },
]

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`

const rowStyle = { wordBreak: 'break-word' }

const cellEdit = {
    mode: 'click',
    blurToSave: true,
}

const ExpandButton = styled.div`
    &: hover {
        cursor: pointer;
    }
`

const expandRow = {
    renderer: row => (
      <>
        {getDonatedSaplings(row)}
      </>
    ),
    showExpandColumn: true,
    expandByColumnOnly: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
        if (isAnyExpands) {
            return <ExpandButton>-</ExpandButton>;
        }
        return <ExpandButton>+</ExpandButton>;
    },
    expandColumnRenderer: ({ expanded }) => {
        if (expanded) {
            return <ExpandButton>-</ExpandButton>;
        }
        return <ExpandButton>+</ExpandButton>;
    }
};

const TableRow = styled.div`
    text-align: center;
    vertical-align: middle;
`

const getDonatedSaplings = (row) => {
    let items = row.items
    console.log(row,'row pls')
    let renderRow = items.map(item => {
        let { id, count, title } = item
        let row = <TableRow key={id}> {count}x {title}</TableRow>
        return row
    })
    return renderRow
}

const getDonationDate = (createdAt) => {
    let date = new Date(parseInt(createdAt))
    Logger(date, createdAt, 'date')
    return (date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear())
}

export function UsersDonatedTable(){
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext)
    let { email } = contextUser || {}

    const [allUserDonationsData, isGetAllUserDonationsLoading, isGetAllUserDonationsError, refetchAllUserDonationsData] = useQueryApi(gql(GET_ALL_USER_DONATIONS), { email })
    useEffect(() => {
        if (allUserDonationsData && allUserDonationsData.getAllUserDonations && !isGetAllUserDonationsError) {
            reset()
        }
    }, [allUserDonationsData, isGetAllUserDonationsError])

    useEffect(() => {
        refetchAllUserDonationsData()
    }, [])

    const [tableState, setTableState] = useState([])

    

    const reset = () => {
        let allUsersDonated = allUserDonationsData && allUserDonationsData.getAllUserDonations
        console.log(allUsersDonated,'allUsersDonated')
        allUsersDonated = allUsersDonated.map((userDonated) => {
            return {...userDonated, createdAt: getDonationDate(userDonated.createdAt)}
        })
        allUsersDonated && setTableState(allUsersDonated)
    }

    return (
        <>
                <BootstrapTable
                    remote={{ cellEdit: true }}
                    keyField='id'
                    data={tableState}
                    columns={columns}
                    rowStyle={rowStyle}
                    expandRow={ expandRow }
                    cellEdit={cellEditFactory(cellEdit)}
                    pagination={paginationFactory()} />}
        </>
    )
}