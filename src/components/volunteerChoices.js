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
import { UPDATE_USER_MUTATION, availableWhenOptions, availableWhatOptions, MarkTitle } from '../constants'
import { showToast } from '../utils'

import volunteerLogoImage from '../images/moretrees-volunteer-logo.png'
import { SelectDropdown } from './SelectDropdown'
import Logger from './Logger'

const Wrapper = styled.div`
    margin: 10px;
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
const Section = styled.div`
    display: flex;
    flex-direction: column;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    @media all and (max-width: 800px) {
        justify-content: center;
        flex-direction: column;
        align-items: center
    }
`

const MarkdownContainer = styled.div`
    margin-left: 20px;
    @media all and (max-width: 800px) {
        margin: 5px 0 0 5px;
    }
`
const DropdownContainer = styled(RowContainer)`
    margin-left: 20px;
    justify-content: space-between;
    @media all and (max-width: 800px){
        margin-left: 0px;
        flex-direction: column;
        align-items: center
    }
`

function VolunteerChoices() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken, setRegisterModal } = useContext(UserContext);
    const [selectedOptionObject, setSelectedOptionObject] = useState({ what: null, when: null })
    const client = useClient()

    const onSubmit = () => {
        let { email, twitterId, instaId } = contextUser || {}
        if (email || twitterId || instaId) {
            
            let {whenSelected, whatSelected} = getOptionsSelected()
            
            let input = { availableWhen: whenSelected, availableWhat: whatSelected, email, twitterId, instaId }
            setUpdateUserVariables({ userInput: input })
        }
        else {
            setRegisterModal(true)
        }

    }

    const [updateUserData, updateUserLoading, updateUserError, setUpdateUserVariables, setUpdateUserData] = useMutationApi(gql(UPDATE_USER_MUTATION))

    useEffect(() => {
        console.log(updateUserData, 'useEffect updateUserData')
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

    const volunteerText = `We would love to have more people work with us to plant moretrees on this planet.
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
    console.log(selectedOptionObject, contextUser, { whatSelected, whenSelected }, disable, 'ssr issue here')
    
    return (
        <Wrapper>
            <Section>
                <Container>
                    <SectionLogo src={volunteerLogoImage} />
                    <MarkTitle> Volunteer </MarkTitle>
                </Container>
                <MarkdownContainer>
                    <ReactMarkdown source={volunteerText} />
                </MarkdownContainer>
            </Section>
            {client &&
                <>
                    <DropdownContainer>
                        <SelectDropdown placeholder={'What would you like to do?'} selectedOption={ whatSelected ?{ value: whatSelected, label: whatSelected } : null}
                            options={availableWhatOptions} onChange={(option) => { setSelectedOptionObject({ ...selectedOptionObject, what: option.value }) }} />
                        <SelectDropdown placeholder={'When are you available?'} selectedOption={whenSelected ? { value: whenSelected, label: whenSelected }: null}
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