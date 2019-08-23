

import styled from 'styled-components'
import Modal from 'react-modal'
import { useState, useEffect } from 'react'

import Login from './login'
import Register from './register'
import useDataApi from './hooks/useDataApi'
import useLoginApi from './hooks/useLoginApi'
import useLocalStorage from './hooks/useLocalStorage'
import UserAvatar from './UserAvatar'
import { GRAPHQL_ENDPOINT, POST } from '../constants'

import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const LOGIN = 'Login'
const REGISTER = 'Register'

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
        setDetails({ email, password })
        toggleModal(modalStatus, setModalStatus, LOGIN)
    }

    const onRegister = ({ email, userName, password }) => {

        // const REGISTER_MUTATION = `mutation registerUser {
        //     registerUser(userName: "${userName}", email: "${email}", password:"${password}") {
        //       userName
        //       email
        //       error
        //       message
        //     }
        //   }`

        // setUrl({ url: GRAPHQL_ENDPOINT, query: REGISTER_MUTATION, method: POST })
        toggleModal(modalStatus, setModalStatus, REGISTER)
        // onRegistered() show a toast message on user registration
    }

    const onLogout = () => {
        setLoginData(null)
        setUserInStore(null)
    }



    // const onResponseFromRegisterApi = (data, isError) => {
    //     const errorInRegisterUser = (data && data.data.registerUser && data.data.registerUser.error) || isError
    //     const registerUser = (data && data.data.registerUser)
    //     if (errorInRegisterUser){
    //         // show a toast if register returns error
    //     }
    //     return {registerUser, errorInRegisterUser}
    // }



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
        else {
            // Show a toast if login returns error 
        }
        return { loggedInUser, errorInLoginUser }
    }
    const [loginData, loading, error, setDetails, setLoginData] = useLoginApi()
    const { loggedInUser, errorInLoginUser } = onResponseFromLoginApi(loginData, error)
    console.log(loading, loginData, error, 'LOGIN')

    return (
        <Header>
            <TitleLogo>MoreTrees</TitleLogo>
            <AppHeader>
                {
                    loggedInUser ?
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
