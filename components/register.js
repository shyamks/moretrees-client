import styles from './styles/loginStyles';
import {useRef} from 'react'

function Register({ onSubmit }) {
    let emailRef = useRef(null)
    let userNameRef = useRef(null)
    let passwordRef = useRef(null)

    const validDetails = ({emailId, userName, password}) =>{
        return emailId && userName && password && emailId.length && userName.length && password.length
    }
    
    const onRegister = () => {
        let emailId = emailRef.current.value
        let userName = userNameRef.current.value
        let password = passwordRef.current.value
        console.log({emailId, userName, password},'register')
        if (validDetails({emailId, userName, password}))
            onSubmit({emailId, userName, password})
    }
    
    return (
        <div className="login-container">
            <section className="login" id="login">
                <div className="login-form">
                    <input ref={emailRef} type="text" className="login-input" placeholder="Email" required autoFocus />
                    <input ref={userNameRef} type="name" className="login-input" placeholder="Username" required />
                    <input ref={passwordRef} type="password" className="login-input" placeholder="Password" required />
                    <button onClick={onRegister} type="submit" className="login-button">Register</button>
                </div>
            </section>
            <style jsx>{styles}</style>
        </div>
    );
}
export default Register