import { useState, useRef, useEffect, useContext } from 'react'
import React from 'react'
import styled from 'styled-components'

import Checkbox from './Checkbox'
import PriorityList from './PriorityList'
import Input from './Input'
import Button from './Button';
import gql from 'graphql-tag';
import useQueryApi from './hooks/useQueryApi';
import useMutationApi from './hooks/useMutationApi';
import useLazyQueryApi from './hooks/useLazyQueryApi';
import UserContext from './UserContext';
import { UPDATE_USER_MUTATION, GET_USER_QUERY, GET_VOLUNTEER_QUERY } from '../constants'

const ListContainer = styled.div`
    display: flex;
    @media screen and (max-width: 700px) {
        flex-direction: column;
    }

`

const PriorityListContainer = styled.div`
    @media screen and (max-width: 700px) {
        margin: -10px -10px 0px -10px;
        
    }
`

const OptionList = styled.div`
    padding: 20px;
    @media screen and (max-width: 700px) {
        padding: 20px 0px 20px 0px;
    }
`

const Option = styled.div`
    padding: 5px;
    display: flex;
    
`

const OptionLabel = styled.span`
    margin: 10px;
    display:inline-block;
    width: 400px;
    word-wrap: break-word;
`
const Wrapper = styled.div`
    margin: 30px;
`


function VolunteerChoices() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);
    const getCheckedItemsFromStore = (user) => {
        let selectedVolunteerOptions = (user && user.volunteerOptions || [])
        // console.log(user,'heli eega')
        let userCheckedItems = new Map()
        if (selectedVolunteerOptions) {
            for (let item of selectedVolunteerOptions) {
                userCheckedItems.set(item.id, true)
            }
        }
        // console.log(userCheckedItems, selectedVolunteerOptions, 'cmon')
        return [userCheckedItems, selectedVolunteerOptions]
    }

    const jsonEqual = (a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    const differentFromLocalStorage = (object, objectFromStore) => {
        return !jsonEqual(object, objectFromStore)
    }

    const onResponseFromUpdateUser = (updateData, isError) => {
        if (!updateData) return { loggedInUser: contextUser, errorInLoginUser: null }
        let data = updateData.data
        // console.log(data, isError, 'onResponseFromUpdateUser')
        let updateUser = data.updateUser
        const errorInUpdateUser = (updateUser && updateUser.error) || isError
        const loggedInUser = updateUser || contextUser
        console.log(loggedInUser, errorInUpdateUser, 'now')
        if (!errorInUpdateUser) {
            if (differentFromLocalStorage(loggedInUser, contextUser)) {
                storeUserInContext(loggedInUser)
            }
        }
        return { loggedInUser, errorInUpdateUser }
    }

    const handleChange = (e, volunteerOptions) => {
        console.log(e, volunteerOptions, 'what hapd')
        const itemName = e.target.name
        const item = volunteerOptions.filter(checkbox => checkbox.id == itemName)[0]
        const isChecked = e.target.checked
        let prevCheckedPriority = selectedOption.checkedPriority
        if (isChecked) {
            prevCheckedPriority.push(item)
        }
        else {
            let index = prevCheckedPriority.findIndex((arrayItem) => arrayItem.optionText == item.optionText)
            console.log(index, item, 'indes')
            if (index > -1) {
                prevCheckedPriority.splice(index, 1);
            }
        }
        setOption(prevState => ({ checkedItems: prevState.checkedItems.set(itemName, isChecked), checkedPriority: prevCheckedPriority }))
    }

    const onSubmitVolunteerOptions = () => {
        let { email } = contextUser || {}
        let priorityList = selectedOption.checkedPriority
        let inputVolunteerList = priorityList.map((item) => {
            let { optionText, status, id } = item
            return { optionText, status, id }
        })
        let input = { volunteerOptions: inputVolunteerList, email }
        setUpdateUserVariables({ userInput: input })
    }

    const [updateUserData, updateUserLoading, updateUserError, setUpdateUserVariables, setUpdateUserData] = useMutationApi(gql(UPDATE_USER_MUTATION))
    const [userData, userLoading, userError, setUserVariables, setUserData] = useLazyQueryApi(gql(GET_USER_QUERY))


    useEffect(() => {
        console.log(updateUserData, 'useEffect updateUserData')
        if (updateUserData) {
            let updateUser = updateUserData.data.updateUser
            let [checkedItems, checkedPriority] = getCheckedItemsFromStore(updateUser)
            setOption({ checkedItems, checkedPriority })
            storeUserInContext(updateUser)
        }
    }, [updateUserData])

    useEffect(() => {
        console.log(userData, 'useEffect userData')
        if (userData) {
            let getUser = userData.data.getUser
            let [checkedItems, checkedPriority] = getCheckedItemsFromStore(getUser)
            setOption({ checkedItems, checkedPriority })
            storeUserInContext(getUser)
        }
    }, [userData])

    useEffect(() => {
        console.log(contextUser, 'useEffect contextUser')
        let [checkedItems, checkedPriority] = getCheckedItemsFromStore(contextUser)
        setOption({ checkedItems, checkedPriority })
    }, [contextUser])

    const [volunteerOptionsData, isGetVolunteerOptionsLoading, isGetVolunteerOptionsError, refetchVolunteerOptionsData] = useQueryApi(gql(GET_VOLUNTEER_QUERY), {status: "ACTIVE"})
    const { loggedInUser, errorInUpdateUser } = onResponseFromUpdateUser(updateUserData, updateUserError)
    const volunteerOptions = volunteerOptionsData && volunteerOptionsData.getVolunteerOptions

    const [selectedOption, setOption] = useState({ checkedItems: new Map(), checkedPriority: [] })


    let industryRef = useRef(null)
    let roleRef = useRef(null)
    // console.log(contextUser, selectedOption, 'contextUser')

    // console.log(getVolunteerOptionsData, isGetVolunteerOptionsLoading, isGetVolunteerOptionsError, 'getVolunteerOptions')

    return (
        <Wrapper>
            <div> There is nothing better than doing it.</div>
            <div> What would you like to do ?</div>
            <>
                <ListContainer>
                    <OptionList>
                        {
                            volunteerOptions && volunteerOptions.map(item => {
                                return (
                                    <Option key={item.id}>
                                        <OptionLabel>
                                            {item.optionText}
                                        </OptionLabel>
                                        <Checkbox
                                            name={item.id}
                                            checked={selectedOption.checkedItems.get(item.id)}
                                            onChange={(e) => handleChange(e, volunteerOptions)}
                                        />
                                    </Option>
                                )
                            })
                        }
                    </OptionList>
                    <PriorityListContainer>
                        <PriorityList items={selectedOption.checkedPriority} />
                    </PriorityListContainer>
                </ListContainer>
                <Button onClick={onSubmitVolunteerOptions}> Submit </Button>
            </>
        </Wrapper>
    )
}

export default VolunteerChoices