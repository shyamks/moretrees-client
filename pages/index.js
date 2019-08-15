import React, { useState } from 'react';
import styles from './styles/main'
import Link from 'next/link'
import Router from 'next/router'
import Modal from 'react-modal'

import Document, { Html, Head, Main, NextScript } from 'next/document'

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

const navigateTo = (page, params) => {
    Router.push({
        pathname: `/${page}`
        // query: { name: 'Zeit' },
    })
}

const toggleModal = (modalStatus, modalSetter) => {
    modalSetter(!modalStatus);
}


function MainPage() {
    let [isModalOpen, setModal] = useState(false);
    return (
        <div>
            <div className="header">
                <div>MoreTrees</div>
                <div className="userEntry">
                    <div onClick={() => toggleModal(isModalOpen,setModal)}>Login</div>/
                    <div>Register</div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onAfterOpen={()=> {}}
                onRequestClose={()=> setModal(false)}
                style={customStyles}
                contentLabel="Example Modal"
            >

                <button onClick={() => toggleModal(isModalOpen,setModal)}>close</button>
                <div>I am a modal</div>
                <form>
                    <input />
                    <button>tab navigation</button>
                    <button>stays</button>
                    <button>inside</button>
                    <button>the modal</button>
                </form>
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