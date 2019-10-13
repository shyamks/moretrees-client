import { useState, useRef, useEffect, useContext } from 'react'
import React from 'react'
import styled from 'styled-components'

import Checkbox from './Checkbox'
import PriorityList from './PriorityList'
import Input from './Input'
import Button from './Button';

import ReactMarkdown from 'react-markdown'
import gql from 'graphql-tag';
import useQueryApi from './hooks/useQueryApi';
import useMutationApi from './hooks/useMutationApi';
import useLazyQueryApi from './hooks/useLazyQueryApi';
import useClient from './hooks/useClient';
import UserContext from './UserContext';
import { UPDATE_USER_MUTATION, GET_USER_QUERY, GET_VOLUNTEER_QUERY, availableWhenOptions, availableWhatOptions } from '../constants'
import { showToast } from '../utils'

import volunteerLogoImage from '../images/moretrees-volunteer-logo.png'
import { SelectDropdown } from './SelectDropdown'
import Logger from './Logger'

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

const SectionLogo = styled.img`
    width: 55px;
    height: 50px;
    margin: 10px 5px 10px 10px;
`
const ButtonContainer = styled.div`
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    `

const RowContainer = styled.div`
    display: flex;
    flex-direction: row;
`
const ColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const DropdownContainer = styled(RowContainer)`
    margin-left: 60px;
    justify-content: space-between;
    @media all and (max-width: 750px){
        flex-direction: column;
    }
`

let selectedOptionObject = {
    what: null,
    when: null
}
function VolunteerChoices() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken, setRegisterModal } = useContext(UserContext);
    const [selectedOptionObject, setSelectedOptionObject] = useState({ what: null, when: null })
    const client = useClient()

    const onSubmit = () => {
        let { email } = contextUser || {}
        if (email) {
            
            let {whenSelected, whatSelected} = getOptionsSelected()
            
            let input = { availableWhen: whenSelected, availableWhat: whatSelected, email }
            setUpdateUserVariables({ userInput: input })
        }
        else {
            setRegisterModal(true)
        }

    }

    const [updateUserData, updateUserLoading, updateUserError, setUpdateUserVariables, setUpdateUserData] = useMutationApi(gql(UPDATE_USER_MUTATION))

    useEffect(() => {
        Logger(updateUserData, 'useEffect updateUserData')
        if (updateUserData) {
            let updateUser = updateUserData.data.updateUser
            if (!(updateUser.error || updateUserError)) {
                storeUserInContext(updateUser)
                showToast('Updated', 'success')
            }
            else {
                showToast('Update failed', 'error')
            }
        }
    }, [updateUserData, updateUserError])

    const volunteerText = `## Volunteer\n\n We would love to have more people work with us to plant moretrees on this planet.
                            \n We are a completely volunteer run initiative
                            \nOur volunteers plant trees, scout locations, help build our website, launch operations in new cities and more.
                            \nOur volunteers are EVERYTHING.`

    const getOptionsSelected = () => {
        let { what, when } = selectedOptionObject
        let whatSelected = what || (contextUser && contextUser.availableWhat)
        let whenSelected = when || (contextUser && contextUser.availableWhen)
        return {whenSelected, whatSelected}
    }
    let {whenSelected, whatSelected} = getOptionsSelected()
    
    let disable = !(whatSelected && whenSelected)
    Logger(selectedOptionObject, contextUser, { whatSelected, whenSelected }, disable, 'ssr issue here')
    
    return (
        <Wrapper>
            <RowContainer>
                <SectionLogo src={volunteerLogoImage}/>
                <ColumnContainer>
                    <ReactMarkdown source={volunteerText} />
                </ColumnContainer>
            </RowContainer>
            {client &&
                <>
                    <DropdownContainer>
                        <SelectDropdown placeholder={'What would you like to do?'} selectedOption={{ value: whatSelected, label: whatSelected }}
                            options={availableWhatOptions} onChange={(option) => { setSelectedOptionObject({ ...selectedOptionObject, what: option.value }) }} />
                        <SelectDropdown placeholder={'When are you available?'} selectedOption={{ value: whenSelected, label: whenSelected }}
                            options={availableWhenOptions} onChange={(option) => { setSelectedOptionObject({ ...selectedOptionObject, when: option.value }) }} />
                    </DropdownContainer>

                    <ButtonContainer>
                        <Button disabled={disable} onClick={onSubmit}> Submit </Button>
                    </ButtonContainer>
                </>}
        </Wrapper>
    )
}

export default VolunteerChoices