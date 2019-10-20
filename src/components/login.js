import { useRef, useState } from 'react'
import React from 'react';
import styled, {keyframes} from 'styled-components'

import { Captcha } from './Recaptcha';
import { isProd, FINAL_ENDPOINT , PAGES} from '../constants';

import 'font-awesome/css/font-awesome.css';
import 'bootstrap-social/bootstrap-social.css';

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

const SocialContainer = styled.div`
    opacity: 1;
    animation: ${input_opacity} 0.8s cubic-bezier(.55, 0, .1, 1);
    margin: 0 0 5px 0;
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

const ForgotPasssword = styled.a`
    flex-direction: row-reverse;
    opacity: 1;
    animation: ${input_opacity} 0.8s cubic-bezier(.55, 0, .1, 1);
    display: flex;
    :hover {
        cursor: pointer;
    }
`

function Login({ onSubmit, navigateTo }) {
    const emailRef = useRef(null)
    const passRef = useRef(null)
    
    const [validCaptcha, setValidCaptcha] = useState(Boolean(process.env.REACT_APP_DISABLE_CATCHA))
    const validDetails = ({email, password}) =>{
        return email && password && email.length && password.length && validCaptcha
    }

    const onLogin = () => {
        let email = emailRef.current.value
        let password = passRef.current.value
        if(validDetails({email, password}))
            onSubmit({email, password});
    }

    const verifyCallback = (response) => {
        if (response){
            setValidCaptcha(true)
        }
    }

    const _handleSignInClick = () => {
        // Authenticate using via passport api in the backend
        // Open Twitter login page
        // Upon successful login, a cookie session will be stored in the client
        window.open(FINAL_ENDPOINT + '/auth/twitter', "_self");
    };

    return (
        <LoginContainer>
            <LoginSection>
                <LoginInputContainer>
                    <Input ref={emailRef} type="text" placeholder="Email" required autoFocus />
                    <Input ref={passRef} type="password" placeholder="Password" required />
                    {/* <SocialContainer>
                        <button tabIndex="0" id="twitter-button" className="btn btn-block btn-social btn-twitter" onClick={_handleSignInClick}>
                            <i className="fa fa-twitter"></i> Sign in with Twitter
                        </button>
                    </SocialContainer> */}
                    <Captcha onSuccess={verifyCallback} />
                    <ForgotPasssword onClick={(e) => navigateTo(e, PAGES.FORGOT_PASSWORD)}> Forgot Password? </ForgotPasssword>
                    <LoginButton onClick={onLogin} type="submit">SIGN IN</LoginButton>
                </LoginInputContainer>
            </LoginSection>
        </LoginContainer>
    );
}
export default Login