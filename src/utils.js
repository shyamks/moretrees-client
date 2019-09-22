import { STORE_USER } from './constants'
import { toast } from 'react-toastify'

import fetch from 'isomorphic-unfetch'

// Polyfill fetch() on the server (used by apollo-client)
if (typeof window === 'undefined') {
  global.fetch = fetch
}

export const getUserFromLocalStorage = () => {
    try {
        let userItem = localStorage.getItem(STORE_USER)
        return userItem ? JSON.parse(userItem) : null
    }
    catch (e) {
        console.log(e)
        return null
    }
}

export const showToast = (text, type) => {
    toast[type](text, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    })
}

let apiCalledStatus = {
    type: '',
    status: false
}

export const apiCallbackStatus = () => {
    
    function setCalledStatus(status, type) {
        apiCalledStatus = { type, status }
    }

    function checkCalledStatus(type) {
        return apiCalledStatus.type == type && apiCalledStatus.status
    }

    return [setCalledStatus, checkCalledStatus]
}