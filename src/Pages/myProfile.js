import Header from '../components/Header'
import React, { useEffect, useRef, useState } from 'react'
import { PageContent } from '../constants'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Button from '../components/Button'
const validate = require("validate.js");

const EMAIL = 'email'
const PASSWORD = 'email'
// const EMAIL = 'email'
// const EMAIL = 'email'
// const EMAIL = 'email'

const getError = (type, value, extraData) => {

    // console.log(type, value, extraData, 'getError params')
    let isError = false, error = null, constraints
    switch (type) {
        case 'name':
            constraints = {
                from: {
                    format: {
                        pattern: "[a-z0-9]+",
                        flags: "i",
                        message: "can only contain a-z and 0-9"
                    }
                }
            }
            error = validate({ from: value }, constraints)
            error = error ? 'Email not valid' : null
            isError = !!error
            break
        case 'email':
            constraints = {
                from: {
                    email: {
                        message: "Doesn't look like a valid email"
                    }
                }
            }
            error = validate({ from: value }, constraints)
            error = error ? 'Email not valid' : null
            isError = !!error
            break
        case 'password':
            constraints = {
                from: {
                    length: {
                        minimum: 6,
                        message: "must be at least 6 characters"
                    }
                }
            }
            error = validate({ from: value }, constraints)
            error = error ? 'Password not valid' : null
            isError = !!error
            break
        case 'confirmPassword':
            constraints = {
                confirmPassword: {
                    equality: "password",
                    presence: true
                }
            }
            let formPassword = (extraData && extraData.formPassword.value) || ''
            error = validate({ password: formPassword, confirmPassword: value }, constraints)
            error = error ? 'Confirm Password not valid' : null
            isError = !!error
            console.log(error, isError, 'confirmPassword here')
            break
        case 'twitter':

        case 'insta':

        case 'fb':

        default:

    }
    let lol = isError ? console.log({ error, isError: !!isError }, 'obj error') : ''
    // 
    return { error, isError: !!isError }


}

export default function MyProfile() {

    let [state, setState] = useState({
        name: { value: '', error: '', isError: false },
        email: { value: '', error: '', isError: false },
        password: { value: '', error: '', isError: false },
        confirmPassword: { value: '', error: '', isError: false },
        twitter: { value: '', error: '', isError: false },
        insta: { value: '', error: '', isError: false },
        fb: { value: '', error: '', isError: false },
    })

    let [disable, setDisable] = useState(false)

    const canDisable = () => {
        let extraData
        let bools = []
        for (let key of Object.keys(state)) {
            extraData = (key == 'confirmPassword') ? { formPassword: state.password } : null
            bools.push(getError(key, state[key] ? state[key].value : '', extraData))
        }
        // console.log(bools, 'canDisable')
        return !bools.reduce((acc, ele) => !ele.isError && acc, true)
    }

    useEffect(() => {
        setDisable(canDisable())
    }, [state])



    const createProfile = () => {
        if (!canDisable()){

        }
    }

    const handleChange = (type, value) => {
        let extraData
        if (type == 'confirmPassword')
            extraData = { formPassword: state.password }
        let { error, isError } = getError(type, value, extraData)
        setState({ ...state, [type]: { value, error, isError } })
    }
    return (
        <>
            <Header />
            <PageContent>
                <Input id={'name'} type={'text'} isError={state['name'].isError} onBlur={(e) => handleChange('name', e.target.value)} placeholder={'Name'} />
                <Input id={'email'} type={'text'} isError={state['email'].isError} onBlur={(e) => handleChange('email', e.target.value)} placeholder={'Email'} />
                <Input id={'password'} type={'password'} isError={state['password'].isError} onBlur={(e) => handleChange('password', e.target.value)} placeholder={'Password'} />
                <Input id={'confirmPassword'} type={'password'} isError={state['confirmPassword'].isError} onBlur={(e) => handleChange('confirmPassword', e.target.value)} placeholder={'Confirm Password'} />
                <Input id={'twitter'} isError={state['twitter'].isError} onBlur={(e) => handleChange('twitter', e.target.value)} placeholder={'Twitter'} />
                <Input id={'insta'} isError={state['insta'].isError} onBlur={(e) => handleChange('insta', e.target.value)} placeholder={'Instagram'} />
                <Input id={'fb'} isError={state['fb'].isError} onBlur={(e) => handleChange('fb', e.target.value)} placeholder={'Facebook'} />
                <Button disabled={disable} onClick={() => createProfile()} width="200px">Create Profile</Button>
            </PageContent>
            <Footer />
        </>
    )
}