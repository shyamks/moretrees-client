

import styled from 'styled-components'
import Modal from 'react-modal'
import {useState} from 'react'

import Login from './login'
import Register from './register'

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


function SiteHeader(){
    let [modalStatus, setModalStatus] = useState({ type: 'Login', open: false });

    const toggleModal = (modalStatus, modalSetter, type) => {
        modalSetter({ type, open: !modalStatus.open });
    }
    return (
        <Header>
            <TitleLogo>MoreTrees</TitleLogo>
            <AppHeader>
                <LoginHeader onClick={() => toggleModal(modalStatus, setModalStatus, 'Login')}>Login</LoginHeader>/
                <RegisterHeader onClick={() => toggleModal(modalStatus, setModalStatus, 'Register')}>Register</RegisterHeader>
            </AppHeader>
            <Modal isOpen={modalStatus.open}
                onAfterOpen={() => { }}
                onRequestClose={() => toggleModal(modalStatus, setModalStatus, modalStatus.type)}
                style={customStyles}
                contentLabel={modalStatus.type}
            >
                {(modalStatus.type === "Login") && <Login />}
                {(modalStatus.type === "Register") && <Register />}
            </Modal>
        </Header>
    )
}

export default SiteHeader;