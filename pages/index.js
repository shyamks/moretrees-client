import React, { useState } from 'react';
import styles from './styles/main'
import Link from 'next/link'
import Router from 'next/router'
import Modal from 'react-modal'
import Login from '../components/login'
import Register from '../components/register'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Document, { Html, Head, Main, NextScript } from 'next/document'

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

const navigateTo = (page, params) => {
    Router.push({
        pathname: `/${page}`
        // query: { name: 'Zeit' },
    })
}

const toggleModal = (modalStatus, modalSetter, type) => {
    modalSetter({ type, open: !modalStatus.open });
}


function MainPage() {
    let [modalStatus, setModalStatus] = useState({ type: 'Login', open: false });
    return (
        <div>
            <div className="header">
                <div>MoreTrees</div>
                <div className="userEntry">
                    <div onClick={() => toggleModal(modalStatus, setModalStatus, 'Login')}>Login</div>/
                    <div onClick={() => toggleModal(modalStatus, setModalStatus, 'Register')}>Register</div>
                </div>
            </div>

            <Modal isOpen={modalStatus.open}
                onAfterOpen={() => { }}
                onRequestClose={() => toggleModal(modalStatus, setModalStatus, modalStatus.type)}
                style={customStyles}
                contentLabel={modalStatus.type}
            >
                {(modalStatus.type === "Login") && <Login />}
                {(modalStatus.type === "Register") && <Register />}

            </Modal>


            <div className="donateVol">
                <button className="donate" onClick={() => navigateTo('donate')}>
                    Donate
                </button>
                <button className="donate" onClick={() => navigateTo('volunteer')}>
                    Volunteer
                </button>
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}

export default MainPage