import './styles/loginStyles.css';
import React, { useRef, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import Recaptcha from 'react-recaptcha'
import { Captcha } from './Recaptcha';
import { isProd } from '../constants';

const input_opacity = keyframes`
    0%   {transform: translateY(-10px); opacity: 0}
    100% {transform: translateY(0px); opacity: 1}
`
const Input = styled.input`
    position: relative;
    width: 100%;
    padding: 10px 5px;
    margin: 0 0 25px 0;
    border: none;
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
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
    color: #60bc0f;
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
                return 'More than 4 characters'
            return 'Can contain a-Z 0-9'
        case 'password':
            return 'More than 7 characters'
        case 'mobile':
            if (value.length <= 9)
                return 'More than 9 characters'
            return 'Error in mobile'
        default:
            return 'Problem with entered text'
    }
}



function Register({ onSubmit }) {
    let emailRef = useRef(null)
    let usernameRef = useRef(null)
    let passwordRef = useRef(null)
    let mobileRef = useRef(null)

    const [validRegister, setValidityOfRegister] = useState({
        email: { status: false, errorText: null },
        username: { status: false, errorText: null },
        password: { status: false, errorText: null },
        mobile: { status: false, errorText: null },
        captcha: Boolean(process.env.REACT_APP_DISABLE_CATCHA)
    })
    const validDetails = ({ email, username, password, mobile, captcha }) => {
        return captcha && validity(email, 'email').status && validity(username, 'username').status && validity(password, 'password').status && validity(mobile, 'mobile').status
    }

    const onRegister = () => {
        let email = emailRef.current.value
        let username = usernameRef.current.value
        let password = passwordRef.current.value
        let mobile = mobileRef.current.value
        let recaptcha = validRegister.captcha
        // console.log({ emailRef, usernameRef, passwordRef, mobileRef }, 'register')
        if (validDetails({ email, username, password, mobile, captcha: recaptcha }))
            onSubmit({ email, username, password, mobile })
    }

    const validity = (value, type) => {
        // console.log({ value, type }, emailRegex, 'check value')
        let statusOfValue = getStatus(value, type)
        let errorOfValue
        if (!statusOfValue)
            errorOfValue = getErrorText(value, type)

        let returnValue = { status: statusOfValue, errorText: errorOfValue }
        // console.log({ ...validRegister, [type]: returnValue }, 'pls console')
        setValidityOfRegister({ ...validRegister, [type]: returnValue })
        return returnValue

    }

    const handleChange = (e, eventType, type) => {
        e.persist()
        // console.log(e, 'tarr')
        if (eventType === 'blur') {
            let classList = e.target.classList
            let value = e.target.value
            // console.log(e, ...classList, 'event')
            if (!validity(value, type).status) {
                ![...classList].includes('error') && e.target.classList.add('error')
            }
            else {
                e.target.classList.remove('error')
            }
            e.target.classList.remove('focused')
        }
        if (eventType == 'focus') {
            e.target.classList.add('focused')
            e.target.classList.remove('error')
        }

    }

    // specifying verify callback function
    var verifyCallback = function (response) {
        if (response) {
            setValidityOfRegister({ ...validRegister, captcha: true })
        }
    };

    return (
        <LoginContainer>
            <LoginSection id="login">
                <LoginInputContainer>
                    <Input ref={usernameRef} type="name" placeholder="Username" required autoFocus
                        onFocus={(e) => handleChange(e, 'focus', 'username')}
                        onBlur={(e) => handleChange(e, 'blur', 'username')} />
                    {/* {!validRegister.username.status && <label className="form-label" for="username">{validRegister.username.errorText}</label>} */}

                    <Input ref={passwordRef} type="password" placeholder="Password" required
                        onFocus={(e) => handleChange(e, 'focus', 'password')}
                        onBlur={(e) => handleChange(e, 'blur', 'password')} />
                    {/* {!validRegister.password.status && <label className="form-label" for="password">{validRegister.password.errorText}</label>} */}

                    <Input ref={mobileRef} type="mobile" placeholder="Mobile" required
                        onFocus={(e) => handleChange(e, 'focus', 'mobile')}
                        onBlur={(e) => handleChange(e, 'blur', 'mobile')} />
                    {/* {!validRegister.password.status && <label className="form-label" for="password">{validRegister.password.errorText}</label>} */}

                    <Input ref={emailRef} type="email" placeholder="Email" required
                        onFocus={(e) => handleChange(e, 'focus', 'email')}
                        onBlur={(e) => handleChange(e, 'blur', 'email')} />
                    {/* {!validRegister.email.status && <label className="form-label" for="email">{validRegister.email.errorText}</label>} */}
                    <Captcha onSuccess={verifyCallback}/>
                    <LoginButton onClick={onRegister} type="submit">Register</LoginButton>
                </LoginInputContainer>
            </LoginSection>
        </LoginContainer>
    );
}
export default Register