

import styled from 'styled-components'
import Modal from 'react-modal'
import { useState, useEffect, useContext, useRef } from 'react'
import 'react-toastify/dist/ReactToastify.css';

import Login from './login'
import Register from './register'
import UserAvatar from './UserAvatar'
import MenuIcon from './svg-icons/menu-icon'

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



/* Hamburger Options Start */
const HamburgerMenu = styled.div`
    display: none;
    @media screen and (max-width: 700px) {
        display: flex;
        justify-content: start;
        flex-direction: column;
        max-height: ${(props) => !props.show ? '20px' : '200px'};
        transition: max-height 1s ease-in-out;
    }
`

const HamburgerOptionsList = styled.div`
    display: flex;
    flex-direction: column;
    flex: ${(props) => !props.show ? '0' : '1'}
    transition: flex 1s ease-in-out;
    overflow: hidden;
`
const HamburgerOptions = styled.div`
    display: flex;
    margin: 10px;
`

const MenuContainer = styled.div`
    display: flex;
    flex-direction: row-reverse;
    &: hover {
        cursor: pointer;
    }
`

const LoginOption = styled.div`

`
/* Hamburger Options End*/

const Header = styled.div`
    padding: 35px;
    justify-content: space-between;
    margin-left: -8px;
    margin-right: -8px;
    // background-color: #454f48;
    background-color: white;
    
    `

const AppHeader = styled.div`
    display: flex;
    flex-direction: horizontal;
    justify-content: space-between;
    @media screen and (max-width: 700px) {
        display: flex;
        justify-content: space-between;
    }
`

const AppLeftHeader = styled.div`
    display: flex;
    flex-direction: horizontal;
    @media screen and (max-width: 700px) {
        display: none;
    }
`

const AppLogo = styled.img`
    display: none;
    @media screen and (max-width: 700px) {
        display: flex;
        justify-content: center;
        width: 120px;
        margin-top: -8px;
        height: 30px;
    }
`


const AppRightHeader = styled.div`
    display: flex;
    flex-direction: horizontal;
    @media screen and (max-width: 700px) {
        display: none;
    }
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

const Logo = styled.img`
    width: 120px;
    margin-top: -8px;
    height:auto;
    margin-right: 20px;
    &: hover{
        cursor: pointer;
    }
`

const navigateTo = (page, params) => {

}

const logoImage = '/static/images/moretrees-logo.jpg'

const noop = () => { }
function SiteHeader(props) {

    let hamburgerRef = useRef(null)
    let [modalStatus, setModalStatus] = useState({ type: LOGIN, data: null, open: false })
    let [hamburgerStatus, setHamburgerStatus] = useState(false)
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);
    const [setCalledStatus, checkCalledStatus] = apiCallbackStatus()

    console.log(hamburgerRef, 'ref')
    const toggleModal = (modalStatus, modalSetter, type, data) => {
        modalSetter({ type, data, open: !modalStatus.open })
    }

    const onHamburgerClick = () => {
        if (hamburgerRef.current.offsetHeight == 0 && hamburgerStatus)
            setHamburgerStatus(false)
        else
            setHamburgerStatus(!hamburgerStatus)
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
        if (registerData && registerData.data && checkCalledStatus(REGISTER)) {
            // const { registerUser, errorInRegisterUser } = onResponseFromRegisterApi(registerData, registerError)
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
            <AppHeader>
                <AppLeftHeader>
                    <Logo src={logoImage} />
                    <Separator />

                    <DonationLink><Link href='/donate'> Donate </Link></DonationLink>
                    <Separator />
                    <VolunteerLink><Link href='/volunteer'> Volunteer </Link></VolunteerLink>
                    {(loggedInUser && !errorInLoginUser) &&
                        <>
                            <Separator />
                            <VolunteerLink><Link href='/myDonations'> My Donations </Link></VolunteerLink>
                        </>
                    }
                </AppLeftHeader>


                {/* for max-width 700px */}
                <AppLogo src={logoImage} />
                <HamburgerMenu show={hamburgerStatus}>
                    <MenuContainer onClick={() => onHamburgerClick()}><MenuIcon /></MenuContainer>

                    <HamburgerOptionsList ref={hamburgerRef} show={hamburgerStatus}>
                        <HamburgerOptions show={hamburgerStatus}><Link href='/donate'> Donate </Link></HamburgerOptions>
                        <HamburgerOptions show={hamburgerStatus}><Link href='/volunteer'> Volunteer </Link></HamburgerOptions>
                        {(loggedInUser && !errorInLoginUser) ?
                            (<>
                                <HamburgerOptions show={hamburgerStatus}>
                                    <Link href='/myDonations'> My Donations </Link>
                                </HamburgerOptions>
                                <HamburgerOptions show={hamburgerStatus}>
                                    <a onClick={() => onLogout()}> Logout </a>
                                </HamburgerOptions>
                            </>
                            ) :
                            (<>
                                <HamburgerOptions show={hamburgerStatus}>
                                    <a onClick={() => toggleModal(modalStatus, setModalStatus, LOGIN)}>Login</a>
                                </HamburgerOptions>
                                <HamburgerOptions show={hamburgerStatus}>
                                    <a onClick={() => toggleModal(modalStatus, setModalStatus, REGISTER)}>Register</a>
                                </HamburgerOptions>
                            </>)
                        }
                    </HamburgerOptionsList>
                </HamburgerMenu>
                {/* for max-width 700px end */}
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
            </AppHeader>
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
