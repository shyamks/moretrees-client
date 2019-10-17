import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { Captcha } from './Recaptcha';
import { isProd } from '../constants';
import { cleanInputValue } from '../utils';

const input_opacity = keyframes`
    0%   {transform: translateY(-10px); opacity: 0}
    100% {transform: translateY(0px); opacity: 1}
`
const Input = styled.input`
    position: relative;
    width: 100%;
    padding: 10px 5px;
    margin: ${props => props.isError ?  '0': '0 0 25px 0'}; ;
    border: none;
    border-bottom: ${props => props.isError ?  '2px solid red': '2px solid rgba(0, 0, 0, 0.2)'};
    box-sizing: border-box;
    background: transparent;
    font-size: 1rem;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    opacity: 1;
    animation: ${input_opacity} 0.8s cubic-bezier(.55, 0, .1, 1);
    transition: border-bottom 0.2s cubic-bezier(.55, 0, .1, 1);
    :focus {
        outline: none;
        border-bottom: 2px solid #60bc0f;
    }
`
const ErrorInputLabel = styled.label`
    font-size: 10px;
    font-style: italic;
    color: red;
    margin: 2px 0 8px 4px;
    display: block;
`

const LoginInputContainer = styled.div`
    padding: 15px;
    box-sizing: border-box;
`
const LoginButton = styled.button`
    padding: 10px;  
    border: none;
    border-radius: 3px;
    background: transparent;
    font-family: 'Roboto', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: ${props => props.disabled ? 'red' : '#60bc0f'};
    cursor: pointer;
    opacity: 1;
    animation: ${input_opacity} 0.8s cubic-bezier(.55, 0, .1, 1);
    transition: background 0.2s ease-in-out;
    :hover {
        background: rgba(0, 0, 0, 0.05);
    }
`

const LoginSection = styled.section`
    position: relative;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 3px;
    background: #FAFAFA;
    overflow: hidden;
    animation: ${input_opacity} 0.2s cubic-bezier(.55, 0, .1, 1);
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                0 1px 5px 0 rgba(0, 0, 0, 0.12),
                0 3px 1px -2px rgba(0, 0, 0, 0.2);
`

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 340px;
    height: auto;
    box-sizing: border-box;
`

const getStatus = (value, type) => {
    let usernameRegex = /^[a-zA-Z0-9]+$/
    let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    switch (type) {
        case 'email':
            return emailRegex.test(value)
        case 'username':
            return value.length > 4 && usernameRegex.test(value)
        case 'password':
            return value.length > 7
        case 'mobile':
            return value.length > 9
        default:
            return false
    }
}

const getErrorText = (value, type) => {
    switch (type) {
        case 'email':
            return 'Not of email type'
        case 'username':
            if (value.length <= 4)
                return 'More than 4 characters required'
            return 'Can contain [a-Z0-9]'
        case 'password':
            return 'More than 7 characters required'
        case 'mobile':
            if (value.length <= 9)
                return 'More than 9 characters required'
            return 'Error in mobile input'
        default:
            return 'Problem with entered text'
    }
}



function Register({ onSubmit }) {
    const [registerDetails, setRegisterDetails] = useState({
        email: { value: '', isError: false, errorText: null },
        username: { value: '', isError: false, errorText: null },
        password: { value: '', isError: false, errorText: null },
        mobile: { value: '', isError: false, errorText: null },
        captcha: Boolean(process.env.REACT_APP_DISABLE_CATCHA)
    })
    const validDetails = ({ email, username, password, mobile, captcha }) => {
        return captcha && validity(email, 'email').isError && validity(username, 'username').isError && validity(password, 'password').isError && validity(mobile, 'mobile').isError
    }

    const onRegister = () => {
        let {
            email: { value: emailValue },
            username: { value: usernameValue },
            password: { value: passwordValue },
            mobile: { value: mobileValue },
            captcha } = registerDetails

        if (validDetails({ emailValue, usernameValue, passwordValue, mobileValue, captcha }))
            onSubmit({ emailValue, usernameValue, passwordValue, mobileValue })
    }

    const validity = (value, type) => {
        let isError = !getStatus(value, type)
        let errorText = isError ? getErrorText(value, type) : null
        return { isError, errorText }
    }

    const handleChange = (e, type) => {
        e.persist()
        let { value } = e.target
        let realValue = cleanInputValue(value)
        let { isError, errorText } = validity(value, type)
        console.log(e, { value, isError, errorText }, 'handleChange')
        setRegisterDetails({ ...registerDetails, [type]: { value: realValue, isError, errorText } })
    }

    // specifying verify callback function
    var verifyCallback = function (response) {
        if (response) {
            setRegisterDetails({ ...registerDetails, captcha: true })
        }
    };

    let {
        email: { value: emailValue, isError: emailIsError, errorText: emailErrorText },
        username: { value: usernameValue, isError: usernameIsError, errorText: usernameErrorText },
        password: { value: passwordValue, isError: passwordIsError, errorText: passwordErrorText },
        mobile: { value: mobileValue, isError: mobileIsError, errorText: mobileErrorText }
    } = registerDetails
    let isButtonError = emailIsError || usernameIsError || passwordIsError || mobileIsError

    return (
        <LoginContainer>
            <LoginSection id="login">
                <LoginInputContainer>
                    <Input value={usernameValue} type="name" placeholder="Username" autoFocus isError={usernameIsError}
                        onChange={(e) => handleChange(e, 'username')} />
                    {usernameIsError && <ErrorInputLabel>{usernameErrorText}</ErrorInputLabel>}

                    <Input value={passwordValue} type="password" placeholder="Password" isError={passwordIsError}
                        onChange={(e) => handleChange(e, 'password')} />
                    {passwordIsError && <ErrorInputLabel>{passwordErrorText}</ErrorInputLabel>}

                    <Input value={mobileValue} type="mobile" placeholder="Mobile" isError={mobileIsError}
                        onChange={(e) => handleChange(e, 'mobile')} />
                    {mobileIsError && <ErrorInputLabel>{mobileErrorText}</ErrorInputLabel>}

                    <Input value={emailValue} type="email" placeholder="Email" isError={emailIsError}
                        onChange={(e) => handleChange(e, 'email')} />
                    {emailIsError && <ErrorInputLabel>{emailErrorText}</ErrorInputLabel>}

                    <Captcha onSuccess={verifyCallback} />
                    <LoginButton disabled={isButtonError} onClick={onRegister} type="submit">Register</LoginButton>
                </LoginInputContainer>
            </LoginSection>
        </LoginContainer>
    );
}
export default Register