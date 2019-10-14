import './styles/loginStyles.css';
import { useRef, useState } from 'react'
import React from 'react';

import Recaptcha from 'react-recaptcha'

function Login({ onSubmit }) {
    const emailRef = useRef(null)
    const passRef = useRef(null)
    
    const [validCaptcha, setValidCaptcha] = useState(false)
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

    return (
        <div className="login-container">
            <section className="login" id="login">
                <div className="login-form">
                    <input ref={emailRef} type="text" className="login-input" placeholder="Email" required autoFocus />
                    <input ref={passRef} type="password" className="login-input" placeholder="Password" required />
                    <Recaptcha
                        sitekey={process.env.CAPTCHA_SITE_KEY}
                        render="explicit"
                        verifyCallback={verifyCallback}
                    />
                    <button onClick={onLogin} type="submit" className="login-button">SIGN IN</button>
                </div>
            </section>
        </div>
    );
}
export default Login