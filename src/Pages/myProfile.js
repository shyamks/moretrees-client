import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'

import { PageContent, PAGES, UPDATE_USER_MUTATION, UPDATE_USER_PROFILE_MUTATION, REGISTER_MUTATION, Page } from '../constants'
import Header from '../components/Header'
import Error from './NotFound'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Button from '../components/Button'
import UserContext from '../components/UserContext'
import useMutationApi from '../components/hooks/useMutationApi'
import { showToast } from '../utils'
import Logger from '../components/Logger'
const validate = require("validate.js");

// const EMAIL = 'email'
// const PASSWORD = 'email'

const getError = (type, value, extraData) => {

    let isError = false, error = null, constraints, formPassword
    switch (type) {
        case 'name':
            constraints = {
                from: {
                    format: {
                        pattern: "[a-z0-9]+",
                        flags: "i",
                        message: "can only contain a-z and 0-9"
                    }
                }
            }
            error = validate({ from: value }, constraints)
            error = error ? 'Name not valid' : null
            isError = !!error
            Logger('ehre', value, type, error)
            break
        case 'email':
            constraints = {
                from: {
                    email: {
                        message: "Doesn't look like a valid email"
                    }
                }
            }
            error = validate({ from: value }, constraints)
            error = error ? 'Email not valid' : null
            isError = !!error
            break
        case 'password':
            constraints = {
                password: {
                    // equality: {
                    //     attribute: "confirmPassword",
                    //     message: "is not complex enough",
                    //     comparator: function (v1, v2) {
                    //         return JSON.stringify(v1) === JSON.stringify(v2);
                    //     }
                    // },
                    length: {
                        minimum: 6,
                        message: "must be at least 6 characters"
                    }
                }
            }
            formPassword = (extraData && extraData.formPassword.value) || ''
            // Logger({ password: value, confirmPassword: formPassword },'password')
            error = validate({ password: value, confirmPassword: formPassword }, constraints)
            error = error ? 'Password not valid' : null
            isError = !!error
            break
        case 'confirmPassword':
            constraints = {
                confirmPassword: {
                    equality: {
                        attribute: "password",
                        message: "is not complex enough",
                        comparator: function (v1, v2) {
                            return JSON.stringify(v1) === JSON.stringify(v2);
                        }
                    },
                    length: {
                        minimum: 6,
                        message: "must be at least 6 characters"
                    }
                }
            }
            formPassword = (extraData && extraData.formPassword.value) || ''
            // Logger({ password: value, confirmPassword: formPassword },'confirmPassword')
            error = validate({ password: formPassword, confirmPassword: value }, constraints)
            error = error ? 'Confirm Password not valid' : null
            isError = !!error
            // Logger(error, isError, 'confirmPassword here')
            break
        case 'twitter':
        case 'insta':
        case 'fb':
            constraints = {
                from: {
                    length:{
                        minimum: 1
                    }
                }
            }
            error = validate({ from: value }, constraints)
            error = error ? `${type} not valid` : null
            isError = !!error
            // Logger(error, isError, `${type} here`)
            break
        default:

    }
    // 
    return { error, isError: !!isError }


}

const UpdateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
export default function MyProfile({ history, location, staticContext, match, route }) {

    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);

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
        // Logger(updateUserData, 'useEffect updateUserData')
        if (updateUserData) {
            let updateUser = updateUserData.data.updateUser
            if (!(updateUser.error || updateUserError)) {

                showToast('Updated', 'success')
                storeUserInContext(updateUser)
            }
            else{
                showToast('Update failed', 'error')
            }
        }
    }, [updateUserData, updateUserError])

    // Logger(updateUserData, 'updateUserData')
    let [state, setState] = useState({
        name: { value: '', error: '', isError: false },
        // email: { value: '', error: '', isError: false },
        password: { value: '', error: '', isError: false },
        confirmPassword: { value: '', error: '', isError: false },
        twitter: { value: '', error: '', isError: false },
        insta: { value: '', error: '', isError: false },
        fb: { value: '', error: '', isError: false },
    })

    let [disable, setDisable] = useState(false)

    const canDisableUpdateProfile = () => {
        let bools = []
        for (let key of Object.keys(state)) {
            
            if (key == 'confirmPassword' || key == 'password') {
                Logger(key,'what')
                let otherKey = (key == 'confirmPassword') ? 'password' : 'confirmPassword'
                let extraData = { formPassword: state[otherKey] }
                let { error, isError } = getError(key, state[key] ? state[key].value : '', extraData)
                let { error: errorPassword, isError: isErrorPassword } = getError(otherKey, state[otherKey] ? state[otherKey].value : '', { formPassword: state[key] ? state[key].value : '' })
                bools.push({ error: error || errorPassword, isError: isError || isErrorPassword })
            }
            else
                bools.push(getError(key, state[key] ? state[key].value : '', {}))
        }
        Logger(bools, Object.keys(state), 'canDisableCreateProfile')
        return !bools.reduce((acc, ele) => !ele.isError || acc, false)
    }

    useEffect(() => {
        setDisable(canDisableUpdateProfile())
    }, [state])

    const updateProfile = () => {
        if (!canDisableUpdateProfile()) {
            onSubmit()
        }
    }

    const handleChange = (type, value) => {
        if (type == 'confirmPassword') {
            let extraData = { formPassword: state.password }
            let otherKey = 'password'
            let { error, isError } = getError(type, value, extraData)
            let { error: errorPassword, isError: isErrorPassword } = getError(otherKey, state[otherKey].value, extraData)
            setState({
                ...state, [type]: { value, error: error || errorPassword, isError: isError || isErrorPassword },
                [otherKey]: { value: state[otherKey].value, error: error || errorPassword, isError: isError || isErrorPassword }
            })
        }
        else if (type == 'password') {
            let extraData = { formPassword: state.confirmPassword }
            let otherKey = 'confirmPassword'
            let { error, isError } = getError(type, value, extraData)
            let { error: errorPassword, isError: isErrorPassword } = getError(otherKey, state[otherKey].value, extraData)
            setState({
                ...state, [type]: { value, error: error || errorPassword, isError: isError || isErrorPassword },
                [otherKey]: { value: state[otherKey].value, error: error || errorPassword, isError: isError || isErrorPassword }
            })
        }
        else {
            let { error, isError } = getError(type, value)
            setState({ ...state, [type]: { value, error, isError } })
        }
    }

    Logger(state, 'state')
    return (
        <Page>
            <Header />
            <PageContent>
                <UpdateContainer>
                    <Input id={'name'} type={'text'} maxLength="10" onChange={(e) => handleChange('name', e.target.value)} placeholder={'Name'} />
                    {/* <Input id={'email'} type={'text'} isError={state['email'].isError} onChange={(e) => handleChange('email', e.target.value)} placeholder={'Email'} /> */}
                    <Input id={'password'} type={'password'} isError={state['password'].isError} onChange={(e) => handleChange('password', e.target.value)} placeholder={'Password'} />
                    <Input id={'confirmPassword'} type={'password'} isError={state['confirmPassword'].isError} onChange={(e) => handleChange('confirmPassword', e.target.value)} placeholder={'Confirm Password'} />
                    <Input id={'twitter'} onChange={(e) => handleChange('twitter', e.target.value)} placeholder={'Twitter'} />
                    <Input id={'insta'} onChange={(e) => handleChange('insta', e.target.value)} placeholder={'Instagram'} />
                    <Input id={'fb'} onChange={(e) => handleChange('fb', e.target.value)} placeholder={'Facebook'} />
                    <Button disabled={disable} onClick={() => updateProfile()} width="200px">Update</Button>
                </UpdateContainer>
            </PageContent>
            <Footer />
        </Page>
    )
}