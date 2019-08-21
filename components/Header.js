

import styled from 'styled-components'
import Modal from 'react-modal'
import { useState, useEffect } from 'react'

import Login from './login'
import Register from './register'
import useDataApi from './hooks/useDataApi'
import useLocalStorage from './hooks/useLocalStorage'
import UserAvatar from './UserAvatar'
import { GRAPHQL_ENDPOINT, POST } from '../constants'

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
};

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


function SiteHeader() {
    let [modalStatus, setModalStatus] = useState({ type: LOGIN, open: false });

    let [loggedInUserFromStore, setUser] = useLocalStorage('loggedInUser', null)

    const toggleModal = (modalStatus, modalSetter, type) => {
        modalSetter({ type, open: !modalStatus.open });
    }

    const onLogin = (data) => {
        let email = data.email
        let password = data.password

        const LOGIN_QUERY = `{
            loginUser(email: "${email}", password: "${password}") {
              email
              accessToken
              message
              error
            }
        }`

        setUrl({ url: GRAPHQL_ENDPOINT, query: LOGIN_QUERY, method: POST })
        toggleModal(modalStatus, setModalStatus, REGISTER)
    }

    const onLogout = () => {
        setData(null)
        setUser(null)
    }

    const gotFromApiAndNotInLocalStorage = (data, loggedInUserFromStore) => {
        return (data && data.data.loginUser) && !loggedInUserFromStore
    }

    const [{ data, isLoading, isError }, setUrl, setData] = useDataApi(GRAPHQL_ENDPOINT)
    let loggedInUser = (data && data.data.loginUser) || loggedInUserFromStore
    if (gotFromApiAndNotInLocalStorage(data, loggedInUserFromStore))
        setUser(loggedInUser)
    console.log(data, isLoading, isError, loggedInUser, 'data');
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
                {(modalStatus.type === REGISTER) && <Register />}
            </Modal>
        </Header>
    )
}

export default SiteHeader