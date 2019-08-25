

import styled from 'styled-components'
import Modal from 'react-modal'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './login'
import Register from './register'
import useLocalStorage from './hooks/useLocalStorage'
import UserAvatar from './UserAvatar'
import { GRAPHQL_ENDPOINT, POST } from '../constants'

import gql from 'graphql-tag';
import useLazyQueryApi from './hooks/useLazyQueryApi';
import useMutationApi from './hooks/useMutationApi';

const LOGIN = 'Login'
const REGISTER = 'Register'

const REGISTER_MUTATION = gql`
    mutation registerUser($username: String!, $email: String!, $password: String!) {
        registerUser(username: $username, email: $email, password: $password) {
            username
            email
            error
            message
        }
    }`

const LOGIN_QUERY = gql`
    query loginUser($email: String!, $password: String!){
        loginUser(email: $email, password: $password) {
          username
          email
          accessToken
          message
          error
        }
    }`

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '30px',
        padding: '0px',
        border: '0px'
    }
}

const Header = styled.div`
    display: flex;
    flex-direction: horizontal;
    justify-content: space-between;
    margin: 1%;
`

const AppHeader = styled.div`
    display: flex;
    flex-direction: horizontal;
`

const LoginHeader = styled.div`
`

const RegisterHeader = styled.div`
`

const TitleLogo = styled.div`
`


function SiteHeader({ onRegistered }) {
    let [modalStatus, setModalStatus] = useState({ type: LOGIN, open: false })

    let [loggedInUserFromStore, setUserInStore] = useLocalStorage('loggedInUser', null)

    const toggleModal = (modalStatus, modalSetter, type) => {
        modalSetter({ type, open: !modalStatus.open })
    }

    const onLogin = ({ email, password }) => {
        setLoginVariables({ email, password })
        toggleModal(modalStatus, setModalStatus, LOGIN)
    }

    const onRegister = ({ email, username, password }) => {


        setRegisterVariables({ email, username, password })
        // setUrl({ url: GRAPHQL_ENDPOINT, query: REGISTER_MUTATION, method: POST })
        toggleModal(modalStatus, setModalStatus, REGISTER)
        // onRegistered() show a toast message on user registration
    }

    const onLogout = () => {
        setLoginData(null)
        setUserInStore(null)
    }

    const gotFromApiAndNotInLocalStorage = (loggedInUser, loggedInUserFromStore) => {
        return loggedInUser && !loggedInUserFromStore
    }
    const onResponseFromLoginApi = (data, isError) => {
        if (!data) return { loggedInUser: null, errorInLoginUser: null }
        let loginUser = data.loginUser
        const errorInLoginUser = (loginUser && loginUser.error) || isError
        const loggedInUser = loginUser || loggedInUserFromStore
        if (!errorInLoginUser) {
            if (gotFromApiAndNotInLocalStorage(loggedInUser, loggedInUserFromStore))
                setUserInStore(loggedInUser)
        }
        return { loggedInUser, errorInLoginUser }
    }
    const onResponseFromRegisterApi = (data, isError) => {
        const errorInRegisterUser = (data && data.data.registerUser && data.data.registerUser.error) || isError
        const registerUser = data && data.data.registerUser
        return { registerUser, errorInRegisterUser }
    }
    const [loginData, loginLoading, loginError, setLoginVariables, setLoginData] = useLazyQueryApi(LOGIN_QUERY)
    const [registerData, registerLoading, registerError, setRegisterVariables, setRegisterData] = useMutationApi(REGISTER_MUTATION)
    const { loggedInUser, errorInLoginUser } = onResponseFromLoginApi(loginData, loginError)
    const { registerUser, errorInRegisterUser } = onResponseFromRegisterApi(registerData, registerError)
    useEffect(() => {
        // Show a toast if login returns error  
        if (errorInLoginUser)
            toast("Login failed!");       
    }, [errorInLoginUser])

    useEffect(() => {
        if (errorInRegisterUser)
            toast("Registration failed!");
        // Show a toast if register returns error         
    }, [errorInRegisterUser])
    console.log(loginLoading, loginData, loginError, 'LOGIN')

    return (
        <Header>
            <TitleLogo>MoreTrees</TitleLogo>
            <AppHeader>
                {
                    (loggedInUser && !errorInLoginUser) ?
                        (<UserAvatar userInfo={loggedInUser} onLogout={onLogout} />) :
                        (<React.Fragment>
                            <LoginHeader onClick={() => toggleModal(modalStatus, setModalStatus, LOGIN)}>Login</LoginHeader>/
                            <RegisterHeader onClick={() => toggleModal(modalStatus, setModalStatus, REGISTER)}>Register</RegisterHeader>
                        </React.Fragment>)

                }
            </AppHeader>
            <Modal isOpen={modalStatus.open}
                onAfterOpen={() => { }}
                onRequestClose={() => toggleModal(modalStatus, setModalStatus, modalStatus.type)}
                style={customStyles}
                contentLabel={modalStatus.type}
            >
                {(modalStatus.type === LOGIN) && <Login onSubmit={(data) => onLogin(data)} />}
                {(modalStatus.type === REGISTER) && <Register onSubmit={(data) => onRegister(data)} />}
            </Modal>
        </Header>
    )
}
export default SiteHeader
