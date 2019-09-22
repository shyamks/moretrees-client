

import styled from 'styled-components'
import Modal from 'react-modal'
import React from 'react';
import { useState, useEffect, useContext, useRef } from 'react'
import { withRouter } from "react-router-dom";
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
// import Link from 'next/link'
import { REGISTER_MUTATION, LOGIN_QUERY } from '../constants';

import logoImage from '../images/moretrees-logo.jpg'

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
const HamburgerOption = styled.div`
    display: flex;
    margin: 10px;
    &: hover {
        cursor: pointer;
    }
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
    justify-content: space-between;
    background-color: white;

    overflow: hidden;
    position: fixed; /* Set the navbar to fixed position */
    top: 0; /* Position the navbar at the top of the page */
    left: 0;
    right: 0;
    width: 100%;
    
    `

const AppHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 30px;
    @media screen and (max-width: 700px) {
        display: flex;
        justify-content: space-between;
    }
`

const AppLeftHeader = styled.div`
    display: flex;
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


const noop = () => { }
function SiteHeader({ history }) {

    let hamburgerRef = useRef(null)
    let [modalStatus, setModalStatus] = useState({ type: LOGIN, data: null, open: false })
    let [hamburgerStatus, setHamburgerStatus] = useState(false)
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);
    const [setCalledStatus, checkCalledStatus] = apiCallbackStatus()

    console.log(hamburgerRef, 'ref')
    const toggleModal = (modalStatus, modalSetter, type, data) => {
        modalSetter({ type, data, open: !modalStatus.open })
    }

    const navigateTo = (path) => {
        history.push(path)
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
    const [loginData, loginLoading, loginError, setLoginVariables, setLoginData] = useLazyQueryApi(gql(LOGIN_QUERY))
    const [registerData, registerLoading, registerError, setRegisterVariables, setRegisterData] = useMutationApi(gql(REGISTER_MUTATION))

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
            <script crossOrigin src="https://js.stripe.com/v3/" async defer></script>
            <AppHeader>
                <AppLeftHeader>
                    <Logo src={logoImage} onClick={() => navigateTo('/')}/>
                    <Separator />

                    <DonationLink onClick={() => navigateTo('donate')}> Donate </DonationLink>
                    <Separator />
                    <VolunteerLink onClick={() => navigateTo('volunteer')}> Volunteer </VolunteerLink>
                    {(loggedInUser && !errorInLoginUser) &&
                        <>
                            <Separator />
                            <VolunteerLink onClick={() => navigateTo('myDonations')}> My Donations </VolunteerLink>
                        </>
                    }
                </AppLeftHeader>


                {/* for max-width 700px */}
                <AppLogo src={logoImage} onClick={() => navigateTo('/')} />
                <HamburgerMenu show={hamburgerStatus}>
                    <MenuContainer onClick={() => onHamburgerClick()}><MenuIcon /></MenuContainer>

                    <HamburgerOptionsList ref={hamburgerRef} show={hamburgerStatus}>
                        <HamburgerOption show={hamburgerStatus} onClick={() => navigateTo('donate')}> Donate </HamburgerOption>
                        <HamburgerOption show={hamburgerStatus} onClick={() => navigateTo('volunteer')}> Volunteer </HamburgerOption>
                        {(loggedInUser && !errorInLoginUser) ?
                            (<>
                                <HamburgerOption show={hamburgerStatus} onClick={() => navigateTo('myDonations')}>
                                     My Donations 
                                </HamburgerOption>
                                <HamburgerOption show={hamburgerStatus}>
                                    <a onClick={() => onLogout()}> Logout </a>
                                </HamburgerOption>
                            </>
                            ) :
                            (<>
                                <HamburgerOption show={hamburgerStatus}>
                                    <a onClick={() => toggleModal(modalStatus, setModalStatus, LOGIN)}>Login</a>
                                </HamburgerOption>
                                <HamburgerOption show={hamburgerStatus}>
                                    <a onClick={() => toggleModal(modalStatus, setModalStatus, REGISTER)}>Register</a>
                                </HamburgerOption>
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

export default withRouter(SiteHeader)
