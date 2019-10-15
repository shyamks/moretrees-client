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
import { showToast, convertNullToEmptyString, getNewId } from '../../utils';
import UserContext from '../UserContext';


const columns = [
    {
        dataField: 'type', text: 'Type', sort: true,
        editor: {
            type: Type.SELECT, options: donationTypes
        }
    },
    {
        dataField: 'title', text: 'Title', sort: true, editable: true, editor: {
            type: Type.TEXTAREA
        }
    },
    {
        dataField: 'subtitle', text: 'Subtitle', editable: true, editor: {
            type: Type.TEXTAREA
        }
    },
    { dataField: 'cost', text: 'Cost', editable: true },
    {
        dataField: 'content', text: 'Content', editable: true, editor: {
            type: Type.TEXTAREA
        }
    },
    { dataField: 'remaining', text: 'Remaining', editable: true },
    {
        dataField: 'status', text: 'Status', editable: true,
        editor: {
            type: Type.SELECT, options: [{value: 'ACTIVE', label: 'ACTIVE'}, {value: 'INACTIVE', label: 'INACTIVE'}]
        }
    },
    {
        dataField: 'removeRow', text: 'RemoveRow', 
        editor: {
            type: Type.SELECT, options: [{value: true, label: 'YES'}, {value: false, label: 'NO'}]
        },
        formatter: (cell, row, rowIndex) => {
            console.log(cell, row, rowIndex, 'formatter')
            return cell == 'true' ? "YES" : "NO"
        }
    },
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
            reset(saplingOptionsData, false)
        }
    }, [saplingOptionsData, isGetSaplingOptionsError])

    useEffect(() => {
        refetchSaplingOptionsData()
    }, [])

    const [updateSaplingsData, updateSaplingsLoading, updateSaplingsError, setUpdateSaplingsVariables, setUpdateSaplingsData] = useMutationApi(gql(UPDATE_SAPLINGS_MUTATION))
    useEffect(() => {
        let updateSaplings = updateSaplingsData && updateSaplingsData.data
        if (updateSaplings && !updateSaplings.updateSaplings.error && !updateSaplingsError) {
            reset(updateSaplingsData, true)
            showToast('Updated Successfully', 'success')
        }
        else if ((updateSaplings && updateSaplings.updateSaplings.error) || updateSaplingsError){
            showToast('Update Failed', 'error')
        }
    }, [updateSaplingsData, updateSaplingsError])

    const [updatedRows, setUpdatedRows] = useState({})

    const [tableState, setTableState] = useState([])

    const [changed, setChanged] = useState(false)

    const update = () => {
        let { email } = contextUser || {}
        if (email) {
            let oldRows = Object.values(updatedRows)
            let rows = oldRows.map((row) => {
                let trimmedRow = lodash.omit(row, ['__typename'])
                trimmedRow['removeRow'] = (trimmedRow['removeRow'] == 'true') ? true: false
                return trimmedRow
            })
            console.log(rows, email, 'newRows')

            rows && setUpdateSaplingsVariables({ saplingInput: rows, email })
        }
        else {
            showToast('Not a user', 'error')
        }
    }

    const reset = (data, update) => {
        let saplingsData
        if (!update)
            saplingsData = (data && data.getSaplingOptions) || []
        else {
            let updateSaplings = data && data.data
            saplingsData = (updateSaplings && !updateSaplings.updateSaplings.error && !updateSaplingsError) ? updateSaplings.updateSaplings.response : []
        }
        if (saplingsData){
            setTableState(saplingsData)
        }
        setChanged(false)
    }

    const handleTableChange = (type, { data, cellEdit: { rowId, dataField, newValue } }) => {
        const result = data.map((row) => {
            if (row.id === rowId && !lodash.isEqual(convertNullToEmptyString(row[dataField]), newValue)) {
                const newRow = { ...row }
                newRow[dataField] = newValue
                updatedRows[rowId] = newRow
                console.log(updatedRows,'updatedRowss')
                setUpdatedRows(updatedRows)
                !changed && setChanged(true)
                return newRow;
            }
            return row
        });
        setTableState(result)
    }

    const addRow = () => {
        let newRow = { id: getNewId(), createNewRow: true}
        let array = [...tableState, newRow]
        setTableState(array)
    }

    return (
        <>
            <ButtonContainer>
                <Button disabled={!changed} onClick={() => update()}>Update</Button>
                <Button disabled={!changed} onClick={() => reset(saplingOptionsData, false)}>Reset</Button>
                <Button width={'120px'} onClick={() => addRow()}>Add new row</Button>
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