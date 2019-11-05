import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react'
import lodash from 'lodash'

import { GET_ALL_USERS, availableWhenOptions, availableWhatOptions, UPDATE_USERS_MUTATION, adminOptions, RESPONSE_SUCCESS, RESPONSE_ERROR } from '../../constants';

import BootstrapTable from 'react-bootstrap-table-next'
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import useQueryApi from '../hooks/useQueryApi'
import gql from 'graphql-tag'
import useMutationApi from '../hooks/useMutationApi';
import Button from '../Button';
import { showToast, convertNullToEmptyString, isAdminUser } from '../../utils';
import UserContext from '../UserContext';
import NotFound from '../../Pages/NotFound';

const { SearchBar } = Search;

const columns = [
    { dataField: 'username', text: 'Username', sort: true },
    { dataField: 'email', text: 'Email', sort: true, editable: false },
    {
        dataField: 'availableWhat', text: 'Help with',
        editor: {
            type: Type.SELECT, options: availableWhatOptions
        }
    }, {
        dataField: 'availableWhen', text: 'Help during',
        editor: {
            type: Type.SELECT,
            options: availableWhenOptions
        }
    }, {
        dataField: 'twitterProfile',
        text: 'Twitter'
    }, {
        dataField: 'instaProfile',
        text: 'Instagram'
    }, {
        dataField: 'fbProfile',
        text: 'Facebook'
    }]

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`

const rowStyle = { wordBreak: 'break-word' }

const cellEdit = {
    mode: 'click',
    blurToSave: true,
}

const SearchContainer = styled.div`
    align-self: center;
`

export function UsersTable() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext)
    let { email, twitterId, instaId } = contextUser || {}
    let isAdmin = isAdminUser(contextUser)

    const [allUsersData, isGetAllUsersLoading, isGetAllUsersError, refetchAllUsersData] = useQueryApi(gql(GET_ALL_USERS), { email, twitterId, instaId })
    useEffect(() => {
        if (allUsersData && allUsersData.getAllUsers.responseStatus.status === RESPONSE_SUCCESS && !isGetAllUsersError) {
            reset(allUsersData, false)
        }
    }, [allUsersData, isGetAllUsersError])

    useEffect(() => {
        refetchAllUsersData()
    }, [])

    const [updateUsersData, updateUsersLoading, updateUsersError, setUpdateUsersVariables, setUpdateUsersData] = useMutationApi(gql(UPDATE_USERS_MUTATION))
    useEffect(() => {
        let updateUsers = updateUsersData && updateUsersData.data
        if (updateUsers && updateUsers.updateUsers.responseStatus.status === RESPONSE_SUCCESS && !updateUsersError) {
            reset(updateUsersData, true)
            showToast('Updated Successfully', 'success')
        }
        else if ((updateUsers && updateUsers.updateUsers.responseStatus.status === RESPONSE_ERROR) || updateUsersError) {
            showToast('Update failed', 'error')
        }
    }, [updateUsersData, updateUsersError])

    const [updatedRows, setUpdatedRows] = useState({})
    const [changed, setChanged] = useState(false)

    const [tableState, setTableState] = useState([])

    const reset = (data, update) => {
        let allUsers
        if (!update)
            allUsers = data && data.getAllUsers.users
        else {
            let updateUsers = data && data.data
            allUsers = (updateUsers && updateUsers.updateUsers.responseStatus.status === RESPONSE_SUCCESS && !updateUsersError) ? updateUsers.updateUsers.response : []
        }
        allUsers && setTableState(allUsers)
        setChanged(false)
    }

    const update = () => {
        let { email, twitterId, instaId } = contextUser || {}
        if (email || twitterId || instaId) {
            let oldRows = Object.values(updatedRows)
            let rows = oldRows.map((row) => {
                return lodash.pick(row, ['username', 'email', 'availableWhen', 'availableWhat', 'fbProfile', 'twitterProfile', 'instaProfile'])
            })
            console.log(rows, email, 'newRows')

            rows && setUpdateUsersVariables({ userInput: rows, email, twitterId, instaId })
        }
        else {
            showToast('Not a user', 'error')
        }

    }
    console.log(updateUsersData, 'updateUserData')

    const handleTableChange = (type, { data, cellEdit: { rowId, dataField, newValue } }) => {
        const result = data.map((row) => {
            if (row.id === rowId && !lodash.isEqual(convertNullToEmptyString(row[dataField]),newValue)) {
                // console.log(row[dataField], newValue, !lodash.isEqual(convertNullToEmptyString(row[dataField]),newValue), 'diff')
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
            {isAdmin && tableState &&
                <ToolkitProvider
                    keyField='id'
                    data={tableState}
                    columns={columns}
                    search
                >
                    {
                        props => (
                            <div>
                                <ButtonContainer>
                                    <SearchContainer>
                                        <SearchBar {...props.searchProps} />
                                    </SearchContainer>
                                    <Button disabled={!changed} onClick={() => update()}>Update</Button>
                                    <Button disabled={!changed} onClick={() => reset(allUsersData, false)}>Reset</Button>
                                </ButtonContainer>
                                <BootstrapTable
                                    {...props.baseProps}
                                    bootstrap4={true}
                                    remote={{ cellEdit: true }}
                                    rowStyle={rowStyle}
                                    cellEdit={cellEditFactory(cellEdit)}
                                    pagination={paginationFactory()}
                                    onTableChange={handleTableChange}
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
            }
            {!isAdmin && !isGetAllUsersLoading && <NotFound statusCode={404}/>}
        </>
    )
}