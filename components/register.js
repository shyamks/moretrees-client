import styles from './styles/loginStyles';
import {useRef} from 'react'

function Register({ onSubmit }) {
    let emailRef = useRef(null)
    let usernameRef = useRef(null)
    let passwordRef = useRef(null)

    const validDetails = ({email, username, password}) =>{
        return email && username && password && email.length && username.length && password.length
    }
    
    const onRegister = () => {
        let email = emailRef.current.value
        let username = usernameRef.current.value
        let password = passwordRef.current.value
        console.log({email, username, password},'register')
        if (validDetails({email, username, password}))
            onSubmit({email, username, password})
    }
    
    return (
        <div className="login-container">
            <section className="login" id="login">
                <div className="login-form">
                    <input ref={emailRef} type="text" className="login-input" placeholder="Email" required autoFocus />
                    <input ref={usernameRef} type="name" className="login-input" placeholder="Username" required />
                    <input ref={passwordRef} type="password" className="login-input" placeholder="Password" required />
                    <button onClick={onRegister} type="submit" className="login-button">Register</button>
                </div>
            </section>
            <style jsx>{styles}</style>
        </div>
    );
}
export default Register