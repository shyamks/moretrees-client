import { STORE_USER } from './constants'


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