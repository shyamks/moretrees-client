import { useState, useRef } from 'react'
import styled from 'styled-components'

import Checkbox from './Checkbox'
import PriorityList from './PriorityList'
import Input from './Input'
import Button from './Button';
import useDataApi from './hooks/useDataApi';
import { GRAPHQL_ENDPOINT, POST } from '../constants';

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNoeWFtLmtvZG1hZEBnbWFpbC5jb20iLCJpYXQiOjE1NjY0OTkxNDR9.dPrO7F3ZG8-4LqHICYrrRCbal7JBlCOsiwU7_K1oNeU"
const email = "shyam.kodmad@gmail.com"

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
    let [selectedOption, setOption] = useState({ checkedItems: new Map(), checkedPriority: [] })
    let industryRef = useRef(null)
    let roleRef = useRef(null)
    const GET_VOLUNTEER_QUERY = `{
        getVolunteerOptions(email: "${email}", status: "ACTIVE", accessToken: "${accessToken}") {
          optionText
          status
          id
        }
      }`
    const [volunteerData, isLoading, isError, setUrl, setData] = useDataApi({ initialUrl: GRAPHQL_ENDPOINT, method: POST, query: GET_VOLUNTEER_QUERY }, true)
    const [updateUserData, isUpdateUserDataLoading, isUpdateUserDataError, updateUserDataUrl, updateUserDataMethod] = useDataApi({ initialUrl: GRAPHQL_ENDPOINT })
    const volunteerOptions = volunteerData && volunteerData.data.getVolunteerOptions

    console.log(updateUserData, isUpdateUserDataLoading, isUpdateUserDataError, 'getVolunteerOptions')
    const handleChange = (e, volunteerOptions) => {
        const itemName = e.target.name
        const item = volunteerOptions.filter(checkbox => checkbox.id == itemName)[0]
        const isChecked = e.target.checked
        let prevCheckedPriority = selectedOption.checkedPriority
        if (isChecked) {
            prevCheckedPriority.push(item)
        }
        else {
            let index = prevCheckedPriority.indexOf(item)
            if (index > -1) {
                prevCheckedPriority.splice(index, 1);
            }
        }
        setOption(prevState => ({ checkedItems: prevState.checkedItems.set(itemName, isChecked), checkedPriority: prevCheckedPriority }))
        console.log(selectedOption, 'selectedOption')
    }

    const onSubmitVolunteerOptions = () => {
        console.log(selectedOption,industryRef.current.value, roleRef.current.value, 'selectedOption')
        let priorityList = selectedOption.checkedPriority
        let industry = industryRef.current.value
        let role = roleRef.current.value
        let input = {role, industry, volunteerOptions: priorityList, email, accessToken }
        let UPDATE_USER_MUTATION = `
        mutation updateUser {
            updateUser(input: ${JSON.stringify(input)}){
              username
              email
              bio
              phone
              accessToken
              error
              message
              volunteerOptions {
                optionText
                id
                status
              }
            }
          }`
          console.log(UPDATE_USER_MUTATION,'mutatuion')
          updateUserDataUrl({ url: GRAPHQL_ENDPOINT, method: POST, query: UPDATE_USER_MUTATION })
    }

    return (
        <div>
            <div> There is nothing better than doing it.</div>
            <div> What would you like to do ?</div>
            <React.Fragment>
                <ListContainer>
                    <OptionList>
                        {
                            volunteerOptions && volunteerOptions.map(item => (
                                <Option key={item.id}>
                                    <OptionLabel>
                                        {item.optionText}
                                    </OptionLabel>
                                    <Checkbox
                                        name={item.id}
                                        checked={selectedOption.checkedItems.get(item.id)}
                                        onChange={(e)=>handleChange(e, volunteerOptions)}
                                    />
                                </Option>
                            ))
                        }
                    </OptionList>
                    <PriorityList items={selectedOption.checkedPriority} />
                </ListContainer>
                <div>
                    <div> What do you do?</div>
                    <Input ref={industryRef} placeholder={'Industry'} />
                    <Input ref={roleRef} placeholder={'Role'} />
                </div>
                <Button onClick={onSubmitVolunteerOptions}> Submit </Button>
            </React.Fragment>
        </div>
    )
}

export default VolunteerChoices