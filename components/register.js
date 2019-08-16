import styles from './styles/loginStyles';

function Register() {
    return (
        <div className="login-container">
            <section className="login" id="login">
                <form className="login-form" action="#" method="post">
                    <input type="text" className="login-input" placeholder="User" required autoFocus />
                    <input type="name" className="login-input" placeholder="Username" required />
                    <input type="password" className="login-input" placeholder="Password" required />
                    <button type="submit" className="login-button">Register</button>
                </form>
            </section>
            <style jsx>{styles}</style>
        </div>
    );
}
export default Register