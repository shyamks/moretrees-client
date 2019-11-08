import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect } from 'react'
import lodash from 'lodash'

import { GET_PROJECTS, donationTypes, UPDATE_PROJECTS_MUTATION, RESPONSE_SUCCESS, RESPONSE_ERROR, } from '../../constants';

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
        },
        
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
        },
        style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        }
    },
    { dataField: 'remaining', text: 'Remaining', editable: true },
    {
        dataField: 'status', text: 'Status', editable: true,
        editor: {
            type: Type.SELECT, options: [{value: 'ACTIVE', label: 'ACTIVE'}, {value: 'INACTIVE', label: 'INACTIVE'}]
        }
    }
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

export function AdminProjectsTable() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext)
    let { email } = contextUser || {}

    const [projectsData, isGetProjectsLoading, isGetProjectsError, refetchProjectsData] = useQueryApi(gql(GET_PROJECTS))
    useEffect(() => {
        if (lodash.get(projectsData, 'getProjects.projects') && !isGetProjectsError) {
            reset(projectsData, false)
        }
    }, [projectsData, isGetProjectsError])

    useEffect(() => {
        refetchProjectsData()
    }, [])

    const [updateProjectsData, updateProjectsLoading, updateProjectsError, setUpdateProjectsVariables, setUpdateProjectsData] = useMutationApi(gql(UPDATE_PROJECTS_MUTATION))
    useEffect(() => {
        let updateProjects = updateProjectsData && updateProjectsData.data
        if (updateProjects && updateProjects.updateProjects.responseStatus === RESPONSE_SUCCESS && !updateProjectsError) {
            reset(updateProjectsData, true)
            showToast('Updated Successfully', 'success')
        }
        else if ((updateProjects && updateProjects.updateProjects.responseStatus === RESPONSE_ERROR) || updateProjectsError){
            showToast('Update Failed', 'error')
        }
    }, [updateProjectsData, updateProjectsError])

    const [updatedRows, setUpdatedRows] = useState({})

    const [tableState, setTableState] = useState([])

    const [changed, setChanged] = useState(false)

    const update = () => {
        let { email, twitterId, instaId } = contextUser || {}
        if (email || twitterId || instaId) {
            let oldRows = Object.values(updatedRows)
            let rows = oldRows.map((row) => {
                let trimmedRow = lodash.omit(row, ['__typename'])
                trimmedRow['removeRow'] = (trimmedRow['removeRow'] == 'true') ? true: false
                return trimmedRow
            })
            console.log(rows, email, 'newRows')

            rows && setUpdateProjectsVariables({ saplingInput: rows, email, twitterId, instaId })
        }
        else {
            showToast('Not a user', 'error')
        }
    }

    const reset = (data, update) => {
        let projectsData
        if (!update)
            projectsData = lodash.get(data, 'getProjects.projects') || []
        else {
            let updateProjects = data && data.data
            projectsData = (updateProjects && updateProjects.updateProjects.responseStatus.status === RESPONSE_SUCCESS && !updateProjectsError) ? updateProjects.updateProjects.response : []
        }
        if (projectsData){
            setTableState(projectsData)
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
                <Button disabled={!changed || updateProjectsLoading} onClick={() => update()}>Update</Button>
                <Button disabled={!changed || updateProjectsLoading} onClick={() => reset(projectsData, false)}>Reset</Button>
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