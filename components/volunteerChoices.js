import { useState, useRef, useEffect, useContext } from 'react'
import styled from 'styled-components'

import Checkbox from './Checkbox'
import PriorityList from './PriorityList'
import Input from './Input'
import Button from './Button';
import gql from 'graphql-tag';
import useQueryApi from './hooks/useQueryApi';
import useLocalStorage from './hooks/useLocalStorage';
import useMutationApi from './hooks/useMutationApi';
import useLazyQueryApi from './hooks/useLazyQueryApi';
import UserContext from './UserContext';
import { getUserFromLocalStorage } from '../utils';

const GET_VOLUNTEER_QUERY = gql`
    query getVolunteerOptions($email: String!){
        getVolunteerOptions(email: $email, status: "ACTIVE") {
            optionText
            status
            id
        }
  }`

const UPDATE_USER_MUTATION = gql`
    mutation updateUser($userInput: UserInput!) {
      updateUser(input: $userInput){
        username
        email
        bio
        phone
        industry
        volunteerOptions {
          optionText
          id
          status
        }
        error
        message
      }
    }`

const GET_USER_QUERY = gql`
    query getUser($email: String!) {
      getUser(email: $email){
        username
        email
        bio
        phone
        industry
        volunteerOptions {
          optionText
          id
          status
        }
        error
        message
      }
    }`


// const volunteerOptions = [
//     {
//         id: 'plant1',
//         optionText: 'Plant trees',
//         status: "ACTIVE"
//     },
//     {
//         id: 'plant2',
//         optionText: 'Pick location to plant trees',
//         status: "ACTIVE"
//     },
//     {
//         id: 'plant3',
//         optionText: 'Help locate the areas where more trees could be planted',
//         status: "ACTIVE"
//     },
//     {
//         id: 'plant4',
//         optionText: 'Work with us in the organization in a broader capacity',
//         status: "ACTIVE"
//     },
// ];

const volunteerTimings = [
    {
        name: 'check-box-1',
        key: 'time1',
        label: 'Betweeen 4-5pm',
    },
    {
        name: 'check-box-2',
        key: 'time2',
        label: 'Betweeen 5-6pm',
    },
    {
        name: 'check-box-3',
        key: 'time3',
        label: 'Betweeen 6-7pm',
    },
    {
        name: 'check-box-4',
        key: 'time4',
        label: 'Betweeen 7-5pm',
    },
];


const ListContainer = styled.div`
    display: flex;
`

const OptionList = styled.div`
    padding: 20px;
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
        let industry = industryRef.current.value
        let role = roleRef.current.value
        let input = { role, industry, volunteerOptions: inputVolunteerList, email }
        setUpdateUserVariables({ userInput: input })
        //   updateUserDataUrl({ url: GRAPHQL_ENDPOINT, method: POST, query: UPDATE_USER_MUTATION })
    }

    let { email } = contextUser || {}

    const [updateUserData, updateUserLoading, updateUserError, setUpdateUserVariables, setUpdateUserData] = useMutationApi(UPDATE_USER_MUTATION)
    const [userData, userLoading, userError, setUserVariables, setUserData] = useLazyQueryApi(GET_USER_QUERY)


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
    
    const [volunteerOptionsData, isGetVolunteerOptionsLoading, isGetVolunteerOptionsError, refetchVolunteerOptionsData] = useQueryApi(GET_VOLUNTEER_QUERY, { email })
    const { loggedInUser, errorInUpdateUser } = onResponseFromUpdateUser(updateUserData, updateUserError)
    const volunteerOptions = volunteerOptionsData && volunteerOptionsData.getVolunteerOptions

    const [selectedOption, setOption] = useState(() => {
        let userFromStore = getUserFromLocalStorage()
        let [checkedItems, checkedPriority] = getCheckedItemsFromStore(userFromStore)
        return { checkedItems, checkedPriority }
    })

    let industryRef = useRef(null)
    let roleRef = useRef(null)
    // console.log(contextUser, selectedOption, 'contextUser')

    // console.log(getVolunteerOptionsData, isGetVolunteerOptionsLoading, isGetVolunteerOptionsError, 'getVolunteerOptions')

    return (
        <div>
            <div> There is nothing better than doing it.</div>
            <div> What would you like to do ?</div>
            <React.Fragment>
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
                    <PriorityList items={selectedOption.checkedPriority} />
                </ListContainer>
                <>
                    <div> What do you do?</div>
                    <Input ref={industryRef} placeholder={'Industry'} />
                    <Input ref={roleRef} placeholder={'Role'} />
                </>
                <Button onClick={onSubmitVolunteerOptions}> Submit </Button>
            </React.Fragment>
        </div>
    )
}

export default VolunteerChoices