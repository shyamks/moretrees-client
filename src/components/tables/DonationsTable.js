import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect } from 'react'
import lodash from 'lodash'

import { GET_SAPLING_OPTIONS, donationTypes, UPDATE_SAPLINGS_MUTATION, } from '../../constants';

import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';

import useQueryApi from '../hooks/useQueryApi'
import gql from 'graphql-tag'
import useMutationApi from '../hooks/useMutationApi';
import Button from '../Button';
import { showToast, convertNullToEmptyString } from '../../utils';
import UserContext from '../UserContext';


const columns = [
    {
        dataField: 'type', text: 'Type', sort: true,
        editor: {
            type: Type.SELECT, options: donationTypes
        }
    },
    { dataField: 'title', text: 'Title', sort: true, editable: true },
    { dataField: 'subtitle', text: 'Subtitle', editable: true },
    { dataField: 'cost', text: 'Cost', editable: true },
    { dataField: 'content', text: 'Content', editable: true },
    { dataField: 'remaining', text: 'Remaining', editable: true },
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

export function DonationsTable() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext)
    let { email } = contextUser || {}

    const [saplingOptionsData, isGetSaplingOptionsLoading, isGetSaplingOptionsError, refetchSaplingOptionsData] = useQueryApi(gql(GET_SAPLING_OPTIONS))
    const saplingsDate = (saplingOptionsData && saplingOptionsData.getSaplingOptions) || []
    useEffect(() => {
        if (saplingOptionsData && saplingOptionsData.getSaplingOptions && !isGetSaplingOptionsError) {
            reset()
        }
    }, [saplingOptionsData, isGetSaplingOptionsError])

    const [updateSaplingsData, updateSaplingsLoading, updateSaplingsError, setUpdateSaplingsVariables, setUpdateSaplingsData] = useMutationApi(gql(UPDATE_SAPLINGS_MUTATION))
    useEffect(() => {
        let updateSaplings = updateSaplingsData && updateSaplingsData.data
        if (updateSaplings && !updateSaplings.updateSaplings.error && !updateSaplingsError) {
            setRefetch(true)
            refetchSaplingOptionsData()
        }
    }, [updateSaplingsData, updateSaplingsError])

    const [updatedRows, setUpdatedRows] = useState({})

    const [tableState, setTableState] = useState([])

    const [changed, setChanged] = useState(false)

    const [refetch, setRefetch] = useState(false)
    // useEffect(() => {
    //     if (refetch) {
    //         setRefetch(false)
    //     }
    // },[refetch])

    const update = () => {
        let { email } = contextUser || {}
        if (email) {
            let oldRows = Object.values(updatedRows)
            let rows = oldRows.map((row) => {
                return lodash.omit(row, ['__typename'])
            })
            console.log(rows, email, 'newRows')

            rows && setUpdateSaplingsVariables({ saplingInput: rows, email })
        }
        else {
            showToast('Not a user', 'error')
        }
    }

    const reset = () => {
        let saplingsData = (saplingOptionsData && saplingOptionsData.getSaplingOptions) || []
        // console.log(allUsersDonated,'allUsersDonated')
        // allUsersDonated = allUsersDonated.map((userDonated) => {
        //     return {...userDonated, createdAt: getDonationDate(userDonated.createdAt)}
        // })
        saplingsData && setTableState(saplingsData)
        setChanged(false)
    }

    const handleTableChange = (type, { data, cellEdit: { rowId, dataField, newValue } }) => {
        const result = data.map((row) => {
            if (row.id === rowId && !lodash.isEqual(convertNullToEmptyString(row[dataField]), newValue)) {
                const newRow = { ...row }
                newRow[dataField] = newValue
                updatedRows[rowId] = newRow
                setUpdatedRows(updatedRows)
                !changed && setChanged(true)
                return newRow;
            }
            return row
        });
        setTableState(result)
    }
    return (
        <>
            <ButtonContainer>
                <Button disabled={!changed} onClick={() => update()}>Update</Button>
                <Button disabled={!changed} onClick={() => reset()}>Reset</Button>
            </ButtonContainer>
            {tableState &&
                <BootstrapTable
                    remote={{ cellEdit: true }}
                    onTableChange={handleTableChange}
                    keyField='id'
                    data={tableState}
                    columns={columns}
                    rowStyle={rowStyle}
                    cellEdit={cellEditFactory(cellEdit)}
                    pagination={paginationFactory()} />}
        </>
    )
}