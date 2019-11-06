import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import gql from 'graphql-tag'

import { PageContent, Page, FORGOT_PASSWORD_QUERY, PAGES, RESPONSE_SUCCESS, RESPONSE_ERROR } from '../constants'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'
import Input from '../components/Input'
import { showToast } from '../utils'
import useLazyQueryApi from '../components/hooks/useLazyQueryApi'
const validate = require("validate.js");

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const InputContainer = styled.div`
    margin-bottom: ${props => props.isError ? '34px' : '10px'}
`

const getError = (type, value) => {

    let isError = false, error = null, constraints
    switch (type) {
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
            break
        default:

    }
    // 
    return { error, isError: !!error }


}
export function ForgotPassword({ history }) {
    const sendEmail = () => {
        let email = state['email'].value
        let constraints = {
            from: {
                email: {
                    message: "Doesn't look like a valid email"
                }
            }
        }
        let isError = validate({ from: email }, constraints)
        if (!isError)
            setForgotPasswordVariables({ email })

    }
    let [state, setState] = useState({
        email: { value: '', isError: false, error: null}
    })

    const [forgotPasswordData, forgotPasswordLoading, forgotPasswordError, setForgotPasswordVariables, setForgotPasswordData] = useLazyQueryApi(gql(FORGOT_PASSWORD_QUERY))
    useEffect(() => {
        let forgotPassword = forgotPasswordData && forgotPasswordData.forgotPassword
        if (forgotPassword && forgotPassword.responseStatus.status === RESPONSE_SUCCESS && !forgotPasswordError) {
            showToast('Reset Link sent', 'success')
            history.push(PAGES.INDEX)
        }
        else if (forgotPasswordError || (forgotPassword && forgotPassword.responseStatus.status === RESPONSE_ERROR))
            showToast(forgotPassword.responseStatus.text, 'error')
    }, [forgotPasswordData, forgotPasswordError])

    const handleChange = (type, value) => {
        let { error, isError } = getError(type, value)
        setState({ [type]: { value, error, isError } })
    }

    return (
        <Page>
            <Header />
            <PageContent>
                <Container>
                    <InputContainer isError={state['email'].isError}>
                        <Input id={'email'} type={'text'} placeholder={'Enter email'}
                            value={state['email'].value} isError={state['email'].isError}
                            onChange={(e) => handleChange('email', e.target.value)} />
                    </InputContainer>
                    <Button disabled={(state['email'].isError || forgotPasswordLoading)} onClick={() => sendEmail()} width="200px">Reset password</Button>
                </Container>
            </PageContent>
            <Footer />
        </Page>
    )
}
