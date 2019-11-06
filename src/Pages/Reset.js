import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import lodash from 'lodash'
import gql from 'graphql-tag'
import qs from 'qs'

import Header from '../components/Header'
import { PageContent, Page, RESET_PASSWORD_MUTATION, PAGES, RESPONSE_ERROR, RESPONSE_SUCCESS } from '../constants'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Button from '../components/Button'
import { showToast } from '../utils'
import useMutationApi from '../components/hooks/useMutationApi'

const getError = (type, value, extraData) => {

    let isError = false, error = null, constraints, formPassword
    switch (type) {
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
                isError = (formPassword === value && value.length >=6) ? false : true
                if (formPassword !== value)
                    error = "Passwords don't match"
                else if (value.length < 6)
                    error = "Password length > 5"
            }
            break
        default:

    }
    // 
    return { error, isError }


}

const UpdateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const InputContainer = styled.div`
    margin-bottom: ${props => props.isError ? '0' : '10px'}
`

const InputLabel = styled.label`
    margin: ${props => props.isError ? '16px 0 0 22px' : '0 0 0 22px'}; 
    font-style: italic;
    font-size: 10px;
    color: red;
`
export function Reset({ history, location }) {
    const sendPassword = () => {
        let { 
            password: { value: passValue, isError: passIsError, error: passError },
            confirmPassword: { value: confirmPassValue, isError: confirmPassIsError, error: confirmPassError },
         } = state

        let password = passValue
        let confirmPassword = confirmPassValue
        let { token } = qs.parse(location.search, { ignoreQueryPrefix: true }) || {};
        
        console.log('sendPassword', {password, confirmPassword, token, allow: canDisableUpdateProfile() })
        if (!canDisableUpdateProfile())
            setResetVariables({ password, confirmPassword, token })
    }

    const [state, setState] = useState({
        password: { value: '', error: null, isError: false },
        confirmPassword: { value: '', error: null, isError: false },
    })

    const canDisableUpdateProfile = () => {
        let bools = []
        for (let key of Object.keys(state)) {
            if (key == 'confirmPassword' || key == 'password') {
                let otherKey = (key == 'confirmPassword') ? 'password' : 'confirmPassword'
                let extraData = { formPassword: state[otherKey] }
                let { error, isError } = getError(key, state[key] ? state[key].value : '', extraData)
                let { error: errorPassword, isError: isErrorPassword } = getError(otherKey, state[otherKey] ? state[otherKey].value : '', extraData)
                bools.push({ error: error || errorPassword, isError: isError || isErrorPassword })
            }
            else
                bools.push(getError(key, state[key] ? state[key].value : '', {}))
        }
        // console.log(bools, Object.keys(state), 'canDisableCreateProfile')
        return !bools.reduce((acc, ele) => !ele.isError && acc, true)
    }

    const [resetData, resetLoading, resetError, setResetVariables, setResetData] = useMutationApi(gql(RESET_PASSWORD_MUTATION))
    useEffect(() => {
        let resetPasssword = lodash.get(resetData, 'data.resetPassword')
        if (resetPasssword && resetPasssword.responseStatus.status === RESPONSE_SUCCESS && !resetError){
            showToast('Reset Successfull', 'success')
            history.replace(PAGES.INDEX)
        }
        else if (resetError || (resetPasssword && resetPasssword.responseStatus.status === RESPONSE_ERROR))
            showToast('Something went wrong', 'error')
    }, [resetData, resetError])


    const handleChange = (type, value) => {
        let otherKey = (type == 'confirmPassword') ? 'password' : 'confirmPassword'
        let extraData = { formPassword: state[otherKey] }
        let { error, isError } = getError(type, value, extraData)
        let { error: errorPassword, isError: isErrorPassword } = getError(otherKey, state[otherKey].value, extraData)
        setState({
            ...state, [type]: { value, error: error || errorPassword, isError: isError || isErrorPassword },
            [otherKey]: { value: state[otherKey].value, error: error || errorPassword, isError: isError || isErrorPassword }
        })
    }

    let { 
        password: { value: passValue, isError: passIsError, error: passError },
        confirmPassword: { value: confirmPassValue, isError: confirmPassIsError, error: confirmPassError },
     } = state
    return (
        <Page>
            <Header />
            <PageContent>
                <UpdateContainer>

                    <InputContainer isError={passIsError} r>
                        <Input id={'password'} value={passValue} isError={passIsError} type={'password'} isError={state['password'].isError} onChange={(e) => handleChange('password', e.target.value)} placeholder={'Password'} />
                        {passIsError && <InputLabel isError={passIsError}>{passError}</InputLabel>}
                    </InputContainer>
                    <InputContainer isError={confirmPassIsError}>
                        <Input id={'confirmPassword'} value={confirmPassValue} isError={confirmPassIsError} type={'password'} isError={state['confirmPassword'].isError} onChange={(e) => handleChange('confirmPassword', e.target.value)} placeholder={'Confirm Password'} />
                        {confirmPassIsError && <InputLabel isError={confirmPassIsError}>{confirmPassError}</InputLabel>}
                    </InputContainer>

                    <Button disabled={canDisableUpdateProfile()} onClick={() => sendPassword()} width="200px">Reset</Button>
                </UpdateContainer>
            </PageContent>
            <Footer />
        </Page>
    )
}
