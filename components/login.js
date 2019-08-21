import styles from './styles/loginStyles';
import {useRef} from 'react'

function Login({ onSubmit }) {
    const emailRef = useRef(null)
    const passRef = useRef(null)
    const onLogin = () => {
        let email = emailRef.current.value
        let password = passRef.current.value
        if(email && password && email.length && password.length )
            onSubmit({email, password});
    }
    return (
        <div className="login-container">
            <section className="login" id="login">
                <div className="login-form">
                    <input ref={emailRef} type="text" className="login-input" placeholder="User" required autoFocus />
                    <input ref={passRef} type="password" className="login-input" placeholder="Password" required />
                    <button onClick={onLogin} type="submit" className="login-button">SIGN IN</button>
                </div>
            </section>
            <style jsx>{styles}</style>
        </div>
    );
}
export default Login