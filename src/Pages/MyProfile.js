import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'

import { PageContent, PAGES, UPDATE_USER_MUTATION, UPDATE_USER_PROFILE_MUTATION, REGISTER_MUTATION, Page, GET_USER_QUERY, RESPONSE_SUCCESS } from '../constants'
import Header from '../components/Header'
import Error from './NotFound'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Button from '../components/Button'
import UserContext from '../components/UserContext'
import useMutationApi from '../components/hooks/useMutationApi'
import { showToast, isClickOrEnter } from '../utils'
import NotFound from './NotFound'
import useQueryApi from '../components/hooks/useQueryApi'
const validate = require("validate.js");

const InputContainer = styled.div`
    margin-bottom: ${props => props.isError ? '0' : '10px'}
`

const InputLabel = styled.label`
    margin: ${props => props.isError ? '16px 0 0 22px' : '0 0 0 22px'}; 
    font-style: italic;
    font-size: 10px;
    color: red;
`
const getError = (type, value, extraData) => {

    let isError = false, error = null, constraints, formPassword
    switch (type) {
        case 'name':
            constraints = {
                from: {
                    format: {
                        pattern: "[a-zA-Z  ,.'-0-9]+",
                        flags: "i",
                        message: "can only contain a-z and 0-9"
                    }
                }
            }
            isError = validate({ from: value }, constraints)
            error = isError ? 'Name not valid' : null
            console.log(isError, error,'what now')
            break
        case 'email':
            constraints = {
                from: {
                    email: {
                        message: "Doesn't look like a valid email"
                    }
                }
            }
            isError = validate({ from: value }, constraints)
            error = error ? 'Email not valid' : null
            break
        case 'password':
            formPassword = (extraData && extraData.formPassword.value) || ''
            console.log({ password: value, confirmPassword: formPassword },(formPassword === value && value.length >=6), extraData,'password')
            if (formPassword != '' || value != ''){
                isError = (formPassword === value && value.length >=6) ? false : true
                if (formPassword !== value)
                    error = "Passwords don't match"
                else if (value.length < 6)
                    error = "Password length > 5"
            }
            break
        case 'confirmPassword':
            
            formPassword = (extraData && extraData.formPassword.value) || ''
            console.log({ password: value, confirmPassword: formPassword },(formPassword === value && value.length >=6), extraData,'confirmPassword')
            if (formPassword != '' || value != ''){
                if (formPassword != '' || value != ''){
                    isError = (formPassword === value && value.length >=6) ? false : true
                    if (formPassword !== value)
                        error = "Passwords don't match"
                    else if (value.length < 6)
                        error = "Password length > 5"
                }
            }
            break
        case 'twitter':
        case 'insta':
        case 'fb':
           
            // Logger(error, isError, `${type} here`)
            break
        default:

    }
    return { error, isError: !!isError }
}

const UpdateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
export function MyProfile({ history, location, staticContext, match, route }) {

    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);
    const { email, twitterId, instaId } = contextUser || {}

    let [state, setState] = useState({
        name: { value: '', error: null, isError: false },
        // email: { value: '', error: null, isError: false },
        password: { value: '', error: null, isError: false },
        confirmPassword: { value: '', error: null, isError: false },
        twitter: { value: '', error: null, isError: false },
        insta: { value: '', error: null, isError: false },
        fb: { value: '', error: null, isError: false },
    })

    const [userData, isGetuserLoading, isGetUserError, refetchUserData]= useQueryApi(gql(GET_USER_QUERY), { email, twitterId, instaId })
    useEffect(()=> {
        refetchUserData()
    },[])
    
    const getState = (getUser) => {
        const { fbProfile, instaProfile, twitterProfile, username } = getUser
        return {
            name: { value: username, error: null, isError: false },
            password: { value: '', error: null, isError: false },
            confirmPassword: { value: '', error: null, isError: false },
            twitter: { value: twitterProfile, error: null, isError: false },
            fb: { value: fbProfile || '', error: null, isError: false },
            insta: { value: instaProfile || '', error: null, isError: false },
        }
    }
    useEffect(() => {
        if (userData && userData.getUser.responseStatus.status === RESPONSE_SUCCESS && !isGetUserError){
            const stateObject = getState(userData.getUser)
            setState(stateObject)
        }
    }, [userData, isGetUserError])

    const initialState = userData && getState(userData.getUser)

    const onSubmit = () => {
        let {
            name: { value: usernameValue },
            // email: { value: emailValue },
            password: { value: passwordValue }, confirmPassword: { value: confirmPasswordValue },
            twitter: { value: twitterValue }, insta: { value: instaValue }, fb: { value: fbValue }
        } = state
        let input = { username: usernameValue, password: passwordValue, twitterProfile: twitterValue, instaProfile: instaValue, fbProfile: fbValue }
        let finalInput = { email: contextUser.email }

        for (let inputItem in input) {
            if (input[inputItem])
                finalInput[inputItem] = input[inputItem]
        }
        // Logger(finalInput, 'finalInput')
        setUpdateUserVariables({ userInput: finalInput })
    }


    const [updateUserData, updateUserLoading, updateUserError, setUpdateUserVariables, setUpdateUserData] = useMutationApi(gql(UPDATE_USER_MUTATION))
    useEffect(() => {
        if (updateUserData) {
            const updateUser = updateUserData.data.updateUser
            if (updateUser.responseStatus.status === RESPONSE_SUCCESS || updateUserError) {
                const updatedState = getState(updateUser)
                setState(updatedState)
                storeUserInContext(updateUser)
                showToast('Updated', 'success')                
            }
            else{
                showToast('Update failed', 'error')
            }
        }
    }, [updateUserData, updateUserError])

    const onLogout = (e) => {
        if (isClickOrEnter(e)){
            removeUserInContext()
            history.push(PAGES.INDEX)
        }
    }

    const canDisableUpdateProfile = () => {
        let bools = []
        for (let key of Object.keys(state)) {
            if (key == 'confirmPassword' || key == 'password') {
                const otherKey = (key == 'confirmPassword') ? 'password' : 'confirmPassword'
                const extraData = { formPassword: state[otherKey] }
                const { error, isError } = getError(key, state[key] ? state[key].value : '', extraData)
                const { error: errorPassword, isError: isErrorPassword } = getError(otherKey, state[otherKey] ? state[otherKey].value : '', extraData)
                bools.push({ error: error || errorPassword, isError: isError || isErrorPassword })
            }
            else
                bools.push(getError(key, state[key] ? state[key].value : '', {}))
        }
        console.log(bools, Object.keys(state), 'canDisableCreateProfile')
        return !bools.reduce((acc, ele) => !ele.isError && acc, true)
    }

    const updateProfile = () => {
        if (!canDisableUpdateProfile()) {
            onSubmit()
        }
    }

    const handleChange = (type, value) => {
        const otherKey = (type == 'confirmPassword') ? 'password' : 'confirmPassword'
        if (type == 'confirmPassword' || type == 'password') {
            const extraData = { formPassword: state[otherKey] }
            const { error, isError } = getError(type, value, extraData)
            const { error: errorPassword, isError: isErrorPassword } = getError(otherKey, state[otherKey].value, extraData)
            const changedState = {
                ...state, [type]: { value, error: error || errorPassword, isError: isError || isErrorPassword },
                [otherKey]: { value: state[otherKey].value, error: error || errorPassword, isError: isError || isErrorPassword }
            }
            setState(changedState)
        }
        else {
            const { error, isError } = getError(type, value)
            setState({ ...state, [type]: { value, error, isError } })
        }
    }

    let { name: { value: nameValue, isError: nameIsError, error: nameError },
        password: { value: passValue, isError: passIsError, error: passError },
        confirmPassword: { value: confirmPassValue, isError: confirmPassIsError, error: confirmPassError },
        twitter: { value: twitterValue, isError: twitterIsError, error: twitterError },
        insta: { value: instaValue, isError: instaIsError, error: instaError },
        fb: { value: fbValue, isError: fbIsError, error: fbError } } = state
    const didProfileInfoChange = JSON.stringify(state) !== JSON.stringify(initialState)
    console.log(state, ' state')
    return (
        <Page>
            <Header />
            <PageContent>
                <UpdateContainer>
                    {contextUser &&
                        <>
                            <InputContainer isError={nameIsError}>
                                <Input id={'name'} value={nameValue} isError={nameIsError} type={'text'} maxLength="20" onChange={(e) => handleChange('name', e.target.value)} placeholder={'Name'} />
                                {nameIsError && <InputLabel isError={nameIsError}>{nameError}</InputLabel>}
                            </InputContainer>
                            <InputContainer isError={passIsError}r>
                                <Input id={'password'} value={passValue} isError={passIsError} type={'password'} isError={state['password'].isError} onChange={(e) => handleChange('password', e.target.value)} placeholder={'Password'} />
                                {passIsError && <InputLabel isError={passIsError}>{passError}</InputLabel>}
                            </InputContainer>
                            <InputContainer isError={confirmPassIsError}>
                                <Input id={'confirmPassword'} value={confirmPassValue} isError={confirmPassIsError} type={'password'} isError={state['confirmPassword'].isError} onChange={(e) => handleChange('confirmPassword', e.target.value)} placeholder={'Confirm Password'} />
                                {confirmPassIsError && <InputLabel isError={confirmPassIsError}>{confirmPassError}</InputLabel>}
                            </InputContainer>
                            <InputContainer isError={twitterIsError}>
                                <Input id={'twitter'} value={twitterValue} isError={twitterIsError} onChange={(e) => handleChange('twitter', e.target.value)} placeholder={'Twitter'} />
                                {twitterIsError && <InputLabel isError={twitterIsError}>{twitterError}</InputLabel>}
                            </InputContainer>
                            <InputContainer isError={instaIsError}>
                                <Input id={'insta'} value={instaValue} isError={instaIsError} onChange={(e) => handleChange('insta', e.target.value)} placeholder={'Instagram'} />
                                {instaIsError && <InputLabel isError={instaIsError}>{instaError}</InputLabel>}
                            </InputContainer>
                            <InputContainer isError={fbIsError}>
                                <Input id={'fb'} value={fbValue} isError={fbIsError} onChange={(e) => handleChange('fb', e.target.value)} placeholder={'Facebook'} />
                                {fbIsError && <InputLabel isError={fbIsError}>{fbError}</InputLabel>}
                            </InputContainer>
                            <Button disabled={canDisableUpdateProfile() || !didProfileInfoChange} onClick={() => updateProfile()} width="200px">Update</Button>
                            <Button onClick={(e) => onLogout(e)} width="200px">Logout</Button>
                        </>
                    }
                </UpdateContainer>

                {!contextUser && !isGetuserLoading &&
                    <NotFound statusCode={404} />
                }
            </PageContent>
            <Footer />
        </Page>
    )
}