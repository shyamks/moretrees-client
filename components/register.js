import styles from './styles/loginStyles';
import { useRef, useState } from 'react'

function Register({ onSubmit }) {
    let emailRef = useRef(null)
    let usernameRef = useRef(null)
    let passwordRef = useRef(null)
    let mobileRef = useRef(null)

    const [validRegister, setValidityOfRegister] = useState({
        email: { status: false, errorText: null },
        username: { status: false, errorText: null },
        password: { status: false, errorText: null },
        mobile: { status: false, errorText: null }
    })
    const validDetails = ({ email, username, password , mobile}) => {
        return validity(email, 'email').status && validity(username, 'username').status && validity(password, 'password').status && validity(mobile,'mobile').status
    }

    const onRegister = () => {
        let email = emailRef.current.value
        let username = usernameRef.current.value
        let password = passwordRef.current.value
        let mobile = mobileRef.current.value
        console.log({ emailRef, usernameRef, passwordRef, mobileRef }, 'register')
        if (validDetails({ email, username, password, mobile }))
            onSubmit({ email, username, password, mobile })
    }

    const validity = (value, type) => {
        var usernameRegex = /^[a-zA-Z0-9]+$/;
        var emailRegex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        console.log(value, 'valid')
        const getStatus = (value, type) => {
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

        let statusOfValue = getStatus(value, type)
        let errorOfValue
        if (!statusOfValue)
            errorOfValue = getErrorText(value, type)

        let returnValue = { status: statusOfValue, errorText: errorOfValue }
        console.log({ ...validRegister, [type]: returnValue }, 'pls console')
        setValidityOfRegister({ ...validRegister, [type]: returnValue })
        return returnValue

    }

    const handleChange = (e, eventType, type) => {
        e.persist()
        console.log(e, 'tarr')
        if (eventType === 'blur') {
            let classList = e.target.classList
            let value = e.target.value
            console.log(e, ...classList, 'event')
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

    return (
        <div className="login-container">
            <section className="login" id="login">
                <div className="login-form">
                    <input ref={usernameRef} type="name" className="login-input" placeholder="Username" required autoFocus
                        onFocus={(e) => handleChange(e, 'focus', 'username')}
                        onBlur={(e) => handleChange(e, 'blur', 'username')} />
                    {/* {!validRegister.username.status && <label className="form-label" for="username">{validRegister.username.errorText}</label>} */}

                    <input ref={passwordRef} type="password" className="login-input" placeholder="Password" required
                        onFocus={(e) => handleChange(e, 'focus', 'password')}
                        onBlur={(e) => handleChange(e, 'blur', 'password')} />
                    {/* {!validRegister.password.status && <label className="form-label" for="password">{validRegister.password.errorText}</label>} */}

                    <input ref={mobileRef} type="mobile" className="login-input" placeholder="Mobile" required
                        onFocus={(e) => handleChange(e, 'focus', 'mobile')}
                        onBlur={(e) => handleChange(e, 'blur', 'mobile')} />
                    {/* {!validRegister.password.status && <label className="form-label" for="password">{validRegister.password.errorText}</label>} */}

                    <input ref={emailRef} type="email" className="login-input" placeholder="Email" required 
                        onFocus={(e) => handleChange(e, 'focus', 'email')}
                        onBlur={(e) => handleChange(e, 'blur', 'email')} />
                    {/* {!validRegister.email.status && <label className="form-label" for="email">{validRegister.email.errorText}</label>} */}
                    <button onClick={onRegister} type="submit" className="login-button">Register</button>
                </div>
            </section>
            <style jsx>{styles}</style>
        </div>
    );
}
export default Register