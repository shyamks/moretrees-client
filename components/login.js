import styles from './styles/loginStyles';

function Login() {
    return (
        <div className="login-container">
            <section className="login" id="login">
                <form className="login-form" action="#" method="post">
                    <input type="text" className="login-input" placeholder="User" required autoFocus />
                    <input type="password" className="login-input" placeholder="Password" required />
                    <button type="submit" className="login-button">SIGN IN</button>
                </form>
            </section>
            <style jsx>{styles}</style>
        </div>
    );
}
export default Login