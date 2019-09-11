

import styled from 'styled-components'
import Modal from 'react-modal'
import { useState, useEffect, useContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';

import Login from './login'
import Register from './register'
import UserAvatar from './UserAvatar'

import gql from 'graphql-tag';
import useLazyQueryApi from './hooks/useLazyQueryApi';
import useMutationApi from './hooks/useMutationApi';
import UserContext from './UserContext';
import { showToast, apiCallbackStatus } from '../utils';
import Link from 'next/link'

const LOGIN = 'Login'
const REGISTER = 'Register'
const ERROR = 'Error'

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

const customStyles = (caseForStyle) => {
    let customPadding = '0px'
    if (caseForStyle === ERROR)
        customPadding = '20px'
    let style = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '30px',
            padding: customPadding,
            border: '0px',
            boxShadow: '3px 3px 5px 6px #ccc'
        }
    }
    return style

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

const AppLeftHeader = styled.div`
    display: flex;
    flex-direction: horizontal;
`
const AppRightHeader = styled.div`
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
    margin-right: 20px;
    &: hover{
        cursor: pointer;
    }
`

const DonationLink = styled.div`
    margin-right: 20px;
    &: hover{
        cursor: pointer;
    }
`

const VolunteerLink = styled.div`
    margin-right: 20px;
    &: hover{
        cursor: pointer;
    }
`
const navigateTo = (page, params) => {

}

const noop = () => { }
function SiteHeader(props) {

    // const navigateNow = props.navigate ? props.navigate : noop
    let [modalStatus, setModalStatus] = useState({ type: LOGIN, data: null, open: false })
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);
    const [setCalledStatus, checkCalledStatus] = apiCallbackStatus()
    // let [token, setAuthToken] = useLocalStorage('token', null)

    const toggleModal = (modalStatus, modalSetter, type, data) => {
        modalSetter({ type, data, open: !modalStatus.open })
    }

    const onLogin = ({ email, password }) => {
        setLoginVariables({ email, password })
        setCalledStatus(true, LOGIN)
        toggleModal(modalStatus, setModalStatus, LOGIN)
    }

    const onRegister = ({ email, username, password, mobile }) => {
        setRegisterVariables({ email, username, password, mobile })
        setCalledStatus(true, REGISTER)
        toggleModal(modalStatus, setModalStatus, REGISTER)
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
        if (!errorInLoginUser) {
            // console.log('asdasasdasdfassadfasfsfs')
            if (gotFromApiAndNotInLocalStorage(loggedInUser, contextUser)) {
                storeUserInContext(loggedInUser)
            }
        }
        console.log(loggedInUser, errorInLoginUser, 'pls help')

        return { loggedInUser, errorInLoginUser }
    }
    const onResponseFromRegisterApi = (data, isError) => {
        const errorInRegisterUser = (data && data.data.registerUser && data.data.registerUser.error) || isError
        const registerUser = data && data.data.registerUser
        return { registerUser, errorInRegisterUser }
    }
    const [loginData, loginLoading, loginError, setLoginVariables, setLoginData] = useLazyQueryApi(LOGIN_QUERY)
    const [registerData, registerLoading, registerError, setRegisterVariables, setRegisterData] = useMutationApi(REGISTER_MUTATION)

    useEffect(() => {
        if (loginData && loginData.loginUser && checkCalledStatus(LOGIN)) {
            let loginUser = loginData.loginUser
            // const { loggedInUser, errorInLoginUser } = onResponseFromLoginApi(loginData, loginError)
            console.log(loginData, loginError, 'wtf loginError')
            if (loginUser.error || loginError) {
                showToast("Login failed!", 'error');
            }
            else if (loginUser.username)
                showToast(`Logged in ${loggedInUser.username} !`, 'success')
            setCalledStatus(false)
        }
    }, [loginData, loginError])

    useEffect(() => {
        console.log(registerData, 'out')
        if (registerData && registerData.data && checkCalledStatus(REGISTER)) {
            // const { registerUser, errorInRegisterUser } = onResponseFromRegisterApi(registerData, registerError)
            console.log(registerData, 'inside')

            let registerUser = registerData.data.registerUser
            if (registerUser.error || registerError) {
                showToast("Registration failed!", 'error');
                toggleModal(modalStatus, setModalStatus, ERROR, registerUser.error)
            }
            else if (registerUser && registerUser.username)
                showToast(`${registerUser.username} is registered!`, 'success')
            setCalledStatus(false)
        }
    }, [registerData, registerError])

    const { loggedInUser, errorInLoginUser } = onResponseFromLoginApi(loginData, loginError)
    const { registerUser, errorInRegisterUser } = onResponseFromRegisterApi(registerData, registerError)
    return (
        <Header>
            <AppLeftHeader>
                <TitleLogo>MoreTrees</TitleLogo>
                <Separator />

                {/* <DonationLink onClick={navigateTo('donate')}> Donate </DonationLink>
                <Separator />
                <VolunteerLink onClick={navigateTo('volunteer')}> Volunteer </VolunteerLink>
                {(loggedInUser && !errorInLoginUser) && 
                    <>
                        <Separator/>
                        <VolunteerLink onClick={navigateTo('volunteer')}> My Donations </VolunteerLink>
                    </>
                } */}

                <Link href='/donate'> Donate </Link>
                <Separator />
                <Link href='/volunteer'> Volunteer </Link>
                {(loggedInUser && !errorInLoginUser) &&
                    <>
                        <Separator />
                        <Link href='/myDonations'> My Donations </Link>
                    </>
                }
            </AppLeftHeader>
            <AppRightHeader>
                {
                    (loggedInUser && !errorInLoginUser) ?
                        (<UserAvatar userInfo={loggedInUser} onLogout={onLogout} />) :
                        (<>
                            <LoginHeader onClick={() => toggleModal(modalStatus, setModalStatus, LOGIN)}>Login</LoginHeader>
                            <Separator />
                            <RegisterHeader onClick={() => toggleModal(modalStatus, setModalStatus, REGISTER)}>Register</RegisterHeader>
                        </>)

                }
            </AppRightHeader>
            <Modal isOpen={modalStatus.open}
                onAfterOpen={() => { }}
                onRequestClose={() => toggleModal(modalStatus, setModalStatus, modalStatus.type)}
                style={customStyles(modalStatus.type)}
                contentLabel={modalStatus.type}
            >
                {(modalStatus.type === LOGIN) && <Login onSubmit={(data) => onLogin(data)} />}
                {(modalStatus.type === REGISTER) && <Register onSubmit={(data) => onRegister(data)} />}
                {(modalStatus.type === ERROR) && <ShowError message={modalStatus.data} />}
            </Modal>
        </Header>
    )
}

function ShowError({ message }) {
    return <div>{message}</div>
}

export default SiteHeader
