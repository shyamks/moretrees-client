

import styled from 'styled-components'
import Modal from 'react-modal'
import { useState, useEffect, useContext } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './login'
import Register from './register'
import useLocalStorage from './hooks/useLocalStorage'
import UserAvatar from './UserAvatar'

import gql from 'graphql-tag';
import useLazyQueryApi from './hooks/useLazyQueryApi';
import useMutationApi from './hooks/useMutationApi';
import UserContext from './UserContext';

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
            phone
            bio
            industry
            role
            volunteerOptions {
              optionText
              id
              status
            }
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
    padding: 35px;
    display: flex;
    flex-direction: horizontal;
    justify-content: space-between;
    border-bottom: 3px solid rgba(0,0,0,0.09);
    margin-left: -8px;
    margin-right: -8px;
    background-color: #454f48;
    `

const AppHeader = styled.div`
    display: flex;
    flex-direction: horizontal;
`

const Separator = styled.div`
    border-right: 1px solid green;
    height: 20px;
    margin-right: 20px;
`

const LoginHeader = styled.div`
    margin-right: 20px;
    &: hover{
        cursor: pointer;
    }
`

const RegisterHeader = styled.div`
    &: hover{
        cursor: pointer;
    }
`

const TitleLogo = styled.div`
`


function SiteHeader({ onRegistered }) {
    let [modalStatus, setModalStatus] = useState({ type: LOGIN, open: false })

    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);

    // let [token, setAuthToken] = useLocalStorage('token', null)

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
        removeUserInContext()
        setLoginData(null)
    }

    const gotFromApiAndNotInLocalStorage = (loggedInUser, userInContext) => {
        return loggedInUser && !userInContext
    }
    const onResponseFromLoginApi = (data, isError) => {
        // console.log(data,isError,'hellll')
        if (!data) return { loggedInUser: contextUser, errorInLoginUser: null }
        let loginUser = data.loginUser
        const errorInLoginUser = (loginUser && loginUser.error) || isError
        const loggedInUser = loginUser || contextUser
        // console.log(loggedInUser,errorInLoginUser,'pls help')
        if (!errorInLoginUser) {
            // console.log('asdasasdasdfassadfasfsfs')
            if (gotFromApiAndNotInLocalStorage(loggedInUser, contextUser)) {
                storeUserInContext(loggedInUser)
            }
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
    // console.log(loginLoading, loginData, loginError, 'LOGIN')
    // console.log(contextUser, authToken, 'contextUser')

    return (
        <Header>
            <TitleLogo>MoreTrees</TitleLogo>
            <AppHeader>
                {
                    (loggedInUser && !errorInLoginUser) ?
                        (<UserAvatar userInfo={loggedInUser} onLogout={onLogout} />) :
                        (<React.Fragment>
                            <LoginHeader onClick={() => toggleModal(modalStatus, setModalStatus, LOGIN)}>Login</LoginHeader>
                            <Separator/>
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
