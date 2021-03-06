import { STORE_USER, UserType } from './constants'
import { toast } from 'react-toastify'

import fetch from 'isomorphic-unfetch'
import Logger from './components/Logger'

// Polyfill fetch() on the server (used by apollo-client)
if (typeof window === 'undefined') {
  global.fetch = fetch
}

const MAX_CHAR = 80

export const getUserFromLocalStorage = () => {
    try {
        let userItem = localStorage.getItem(STORE_USER)
        return userItem ? JSON.parse(userItem) : null
    }
    catch (e) {
        Logger(e)
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

export const convertNullToEmptyString = (value) => {
    if (value == null || value == undefined)
        return ''
    return value
}

export const isAdminUser = (user) => {
    return (user && user.type == UserType.ADMIN)
}

export const getNewId = () => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};

export const isClickOrEnter = (e) => {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal. 
    e.persist()
    return (e.type == 'click' || e.charCode == 13)
};

export const cleanInputValue = (value) => {
    let realValue = value && value.trim()
    realValue = (realValue.length > MAX_CHAR) ? realValue.substr(0, MAX_CHAR) : realValue
    return realValue
}

export const index = (obj, is, value) => {
    if (typeof is == 'string')
        return index(obj, is.split('.'), value);
    else if (is.length == 1 && value !== undefined)
        return obj[is[0]] = value;
    else if (is.length == 0)
        return obj;
    else{
        if (obj[is[0]])
            return index(obj[is[0]], is.slice(1), value);
        else{
            obj[is[0]] = {}
            return index(obj[is[0]], is.slice(1), value);
        }

    }
}