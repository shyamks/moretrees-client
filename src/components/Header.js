

import styled, { keyframes } from 'styled-components'
import Modal from 'react-modal'
import React from 'react'
import { useState, useEffect, useContext, useRef } from 'react'
import { withRouter } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'

import Login from './login'
import Register from './register'
import UserAvatar from './UserAvatar'
import MenuIcon from './svg-icons/MenuIcon'

import gql from 'graphql-tag'
import useLazyQueryApi from './hooks/useLazyQueryApi'
import useMutationApi from './hooks/useMutationApi'
import UserContext from './UserContext'
import { showToast, apiCallbackStatus, isClickOrEnter } from '../utils'
// import Link from 'next/link'
import { REGISTER_MUTATION, LOGIN_QUERY, PAGES, UserType, FINAL_ENDPOINT } from '../constants'

import logoImage from '../images/moretrees-logo.jpg'
import Logger from './Logger'

const LOGIN = 'Login'
const REGISTER = 'Register'
const ERROR = 'Error'

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
toast.configure()


/* Hamburger Options Start */
const animateIn = keyframes`
  0% {
    height: 0%;
  }
  30% {
    height: 40%;
    width: 100%;
  }
  100% {
    height: 100%;
  }
`

const HamburgerOptionsList = styled.ul`
    display: flex;
    flex-direction: column;
    transition: flex 1s ease-in-out;
    overflow: hidden;
    animation: ${animateIn} 0.4s ease;
`

const HamburgerOption = styled.li`
    display: flex;
    margin: 10px;
    &: hover {
        cursor: pointer;
    }
`

const MenuContainer = styled.div`
    display: none;
    @media screen and (max-width: 800px) {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        &: hover {
            cursor: pointer;
        }
    }
`

/* Hamburger Options End*/

const Header = styled.div`
    justify-content: space-between;
    background-color: white;

    overflow: hidden;
    position: fixed; /* Set the navbar to fixed position */
    top: 0; /* Position the navbar at the top of the page */
    left: 0;
    right: 0;
    width: 100%;
    z-index: 1000;
    
    `

const AppHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 30px;
    @media screen and (max-width: 800px) {
        display: flex;
        justify-content: space-between;
    }
`

const AppLeftHeader = styled.div`
    display: flex;
    @media screen and (max-width: 800px) {
        display: none;
    }
`

const AppLogo = styled.img`
    display: none;
    @media screen and (max-width: 800px) {
        display: flex;
        justify-content: center;
        width: 120px;
        margin-top: -8px;
        height: 30px;
    }
`


const AppRightHeader = styled.div`
    display: flex;
    @media screen and (max-width: 800px) {
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
    outline: none;
    &: hover{
        cursor: pointer;
    }
`

const RegisterHeader = styled.div`
    outline: none;
    &: hover{
        cursor: pointer;
    }
`

const VolunteerLink = styled.div`
    margin-right: 20px;
    outline: none;
    &: hover{
        cursor: pointer;
    }
`

const Logo = styled.img`
    width: 120px;
    margin-top: -8px;
    height:auto;
    margin-right: 20px;
    outline: none;
    &: hover{
        cursor: pointer;
    }
`

export const GET_LOGGEDIN_USER = gql`
  query GetCartItems {
    user @client
  }
`;

const noop = () => { }

const isServer = () => {
    try {
        return !window
    }
    catch(e) {
        return true
    }
}
function SiteHeader({ history }) {

    let hamburgerRef = useRef(null)
    let [hamburgerStatus, setHamburgerStatus] = useState(false)

    // let [authenticate, setAuthenticate] = useState({})
    // hack to control outside clicks on hamburger
    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
    
        return () => {
          document.removeEventListener("mousedown", handleClick);
        };
      }, []);

    const handleClick = e => {
        if (hamburgerRef.current.contains(e.target)) {
            return;
        }
        // outside click
        setHamburgerStatus(false);
    };

    // console.log(authenticate, 'twitter user')
    let [modalStatus, setModalStatus] = useState({ type: LOGIN, data: null, open: false })
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken, callRegisterModal, setRegisterModal } = useContext(UserContext);

    // social login check
    useEffect(() => {
        console.log('point here')
        // if (!contextUser) {
            fetch(FINAL_ENDPOINT + '/auth/login/success', {
                method: 'GET',
                credentials: 'no-cors',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    // 'Access-Control-Allow-Credentials': true
                }
            }).then(response => {
                if (response.status === 200) return response.json();
                throw new Error('failed to authenticate user');
            }).then(responseJson => {
                console.log(responseJson, 'twitter user')
                storeUserInContext(responseJson.user)
            }).catch(error => {
                console.error('failed =>', error)
                // removeUserInContext()
            })
        // }

    }, [])

    const [setCalledStatus, checkCalledStatus] = apiCallbackStatus()

    const toggleModal = (modalSetter, open, type, data) => {
        modalSetter({ type, data, open })
    }

    const onOpenModal = (modalSetter, type, data) => {
        setHamburgerStatus(false)
        toggleModal(modalSetter, true, type, data)
    }
    const navigateTo = (e,path) => {
        if (isClickOrEnter(e)){
            history.push(path)
        }
    }

    const onHamburgerClick = (e) => {
        if (isClickOrEnter(e)){
            setHamburgerStatus(!hamburgerStatus)
        }
    }

    const onLogin = ({ email, password }) => {
        setHamburgerStatus(false)
        setLoginVariables({ email, password })
        setCalledStatus(true, LOGIN)
        toggleModal(setModalStatus, false, LOGIN)
    }

    const onRegister = ({ email, username, password, mobile }) => {
        setHamburgerStatus(false)
        setRegisterVariables({ email, username, password, phone: mobile })
        setCalledStatus(true, REGISTER)
        toggleModal(setModalStatus, false , REGISTER)
    }

    const onLogout = (e) => {
        if (isClickOrEnter(e)){
            setHamburgerStatus(false)
            fetch(FINAL_ENDPOINT + '/auth/logout', {
                method: 'GET',
                credentials: 'no-cors',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': true
                }
            }).then(response => {
                if (response.status === 200) return response.json()
                throw new Error('failed to logout user')
            }).then(responseJson => {
                console.log('logged out', responseJson)
            }).catch(error => {
                console.error(JSON.stringify(error), 'error while logout')
            })
            removeUserInContext()
            history.push(PAGES.INDEX)
            setLoginData(null)
        }
    }

    const [loginData, loginLoading, loginError, setLoginVariables, setLoginData] = useLazyQueryApi(gql(LOGIN_QUERY))
    const [registerData, registerLoading, registerError, setRegisterVariables, setRegisterData] = useMutationApi(gql(REGISTER_MUTATION))

    useEffect(() => {
        if (loginData && loginData.loginUser && checkCalledStatus(LOGIN)) {
            let loginUser = loginData.loginUser
            // const { loggedInUser, errorInLoginUser } = onResponseFromLoginApi(loginData, loginError)
            storeUserInContext(loginUser)
            Logger(loginData, loginError, 'wtf loginError')
            if (loginUser.error || loginError) {
                showToast("Login failed!", 'error')
            }
            else if (loginUser.username)
                showToast(`Logged in ${loginUser.username} !`, 'success')
            setCalledStatus(false)
        }
    }, [loginData, loginError])

    useEffect(() => {
        if (registerData && registerData.data && checkCalledStatus(REGISTER)) {
            let registerUser = registerData.data.registerUser
            storeUserInContext(registerUser)
            if (registerUser.error || registerError) {
                showToast("Registration failed!", 'error')
                toggleModal(setModalStatus, true, ERROR, registerUser.error)
            }
            else if (registerUser && registerUser.username)
                showToast(`${registerUser.username} is registered!`, 'success')
            setCalledStatus(false)
        }
    }, [registerData, registerError])

    useEffect(() => {
        if (callRegisterModal)
            toggleModal(setModalStatus, true , REGISTER)
    }, [callRegisterModal])

    // if (callRegisterModal) {
    //     toggleModal(setModalStatus, REGISTER)
    // }
    // const { loggedInUser, errorInLoginUser } = onResponseFromLoginApi(loginData, loginError)
    let errorInLogin = (contextUser && contextUser.error) || loginError
    // const { registerUser, errorInRegisterUser } = onResponseFromRegisterApi(registerData, registerError)
    return (
        <Header>
            <AppHeader>
                <AppLeftHeader>
                    <Logo tabIndex="0" src={logoImage} onKeyPress={(e)=> navigateTo(e,PAGES.INDEX) } onClick={(e) => navigateTo(e,PAGES.INDEX)}/>
                    <Separator />
                    <VolunteerLink tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.DONATE)} onClick={(e) => navigateTo(e, PAGES.DONATE)}> Donate </VolunteerLink>
                    <Separator />
                    <VolunteerLink tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.VOLUNTEER)} onClick={(e) => navigateTo(e, PAGES.VOLUNTEER)}> Volunteer </VolunteerLink>
                    {(contextUser && !errorInLogin) &&
                        <>
                            <Separator />
                            <VolunteerLink tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.MY_DONATIONS)} onClick={(e) => navigateTo(e, PAGES.MY_DONATIONS)}> My Donations </VolunteerLink>
                            <Separator />
                            <VolunteerLink tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.PROFILE)} onClick={(e) => navigateTo(e, PAGES.PROFILE)}> Profile </VolunteerLink>
                            {contextUser.type === UserType.ADMIN &&
                                <>
                                    <Separator />
                                    <VolunteerLink tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.ADMIN)} onClick={(e) => navigateTo(e, PAGES.ADMIN)}> Admin </VolunteerLink>
                                </>}
                        </>
                    }
                </AppLeftHeader>


                {/* for max-width 800px */}
                <AppLogo src={logoImage} tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.INDEX)} onClick={(e) => navigateTo(e, PAGES.INDEX)} />
                <MenuContainer ref={hamburgerRef}>
                    <MenuIcon tabIndex="0" onKeyPress={(e) => onHamburgerClick(e)} onClick={(e) => onHamburgerClick(e)} />
                    {hamburgerStatus &&
                        <HamburgerOptionsList show={hamburgerStatus}>
                            <HamburgerOption show={hamburgerStatus} tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.DONATE)} onClick={(e) => navigateTo(e, PAGES.DONATE)}> Donate </HamburgerOption>
                            <HamburgerOption show={hamburgerStatus} tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.VOLUNTEER)} onClick={(e) => navigateTo(e, PAGES.VOLUNTEER)}> Volunteer </HamburgerOption>
                            {(contextUser && !errorInLogin) ?
                                (<>
                                    <HamburgerOption show={hamburgerStatus} tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.MY_DONATIONS)} onClick={(e) => navigateTo(e, PAGES.MY_DONATIONS)}>
                                        My Donations
                                </HamburgerOption>
                                    <HamburgerOption show={hamburgerStatus} tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.PROFILE)} onClick={(e) => navigateTo(e, PAGES.PROFILE)}>
                                        Profile
                                </HamburgerOption>
                                    {contextUser.type === UserType.ADMIN &&
                                        <HamburgerOption show={hamburgerStatus} tabIndex="0" onKeyPress={(e) => navigateTo(e, PAGES.ADMIN)} onClick={(e) => navigateTo(e, PAGES.ADMIN)}>
                                            Admin
                                </HamburgerOption>}
                                    <HamburgerOption show={hamburgerStatus} tabIndex="0" onKeyPress={(e) => onLogout(e)} onClick={(e) => onLogout(e)}>
                                        Logout
                                </HamburgerOption>
                                </>
                                ) :
                                (<>
                                    <HamburgerOption show={hamburgerStatus} tabIndex="0" onKeyPress={(e) => onOpenModal(setModalStatus, LOGIN)} onClick={(e) => onOpenModal(setModalStatus, LOGIN)}>
                                        Login
                                </HamburgerOption>
                                    <HamburgerOption show={hamburgerStatus} tabIndex="0" onKeyPress={(e) => onOpenModal(setModalStatus, REGISTER)} onClick={(e) => onOpenModal(setModalStatus, REGISTER)}>
                                        Register
                                </HamburgerOption>
                                </>)
                            }
                        </HamburgerOptionsList>}
                </MenuContainer>
                {/* for max-width 800px end */}
                <AppRightHeader>
                    {
                        (contextUser && !errorInLogin) ?
                            (<UserAvatar userInfo={contextUser} onLogout={onLogout} />) :
                            (<>
                                <LoginHeader tabIndex="0" onKeyPress={(e) => onOpenModal(setModalStatus, LOGIN)} onClick={() => onOpenModal(setModalStatus, LOGIN)}>Login</LoginHeader>
                                <Separator />
                                <RegisterHeader tabIndex="0" onKeyPress={(e) => onOpenModal(setModalStatus, REGISTER)} onClick={() => onOpenModal(setModalStatus, REGISTER)}>Register</RegisterHeader>
                            </>)

                    }
                </AppRightHeader>
            </AppHeader>
            <Modal isOpen={modalStatus.open}
                onAfterOpen={() => { }}
                onRequestClose={() => {
                    setRegisterModal(false)
                    toggleModal(setModalStatus, false, modalStatus.type)
                }}
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

export default withRouter(SiteHeader)
