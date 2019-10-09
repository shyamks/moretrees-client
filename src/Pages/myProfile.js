import Header from '../components/Header'
import React, { useEffect, useRef, useState, useContext } from 'react'
import { PageContent, PAGES, UPDATE_USER_MUTATION, UPDATE_USER_PROFILE_MUTATION, REGISTER_MUTATION } from '../constants'
import Error from './NotFound'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Button from '../components/Button'
import UserContext from '../components/UserContext'
import useMutationApi from '../components/hooks/useMutationApi'
import gql from 'graphql-tag'
const validate = require("validate.js");

const EMAIL = 'email'
const PASSWORD = 'email'

const getError = (type, value, extraData) => {

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
                    presence: true,
                    length: {
                        minimum: 1
                    }
                }
            }
            let formPassword = (extraData && extraData.formPassword.value) || ''
            error = validate({ password: formPassword, confirmPassword: value }, constraints)
            error = error ? 'Confirm Password not valid' : null
            isError = !!error
            // console.log(error, isError, 'confirmPassword here')
            break
        case 'twitter':
        case 'insta':
        case 'fb':
            constraints = {
                from: {
                    length: {
                        minimum: 1,
                    }
                }
            }
            error = validate({ from: value }, constraints)
            error = error ? `${type} not valid` : null
            isError = !!error
            // console.log(error, isError, `${type} here`)
            break
        default:

    }
    // 
    return { error, isError: !!isError }


}

export default function MyProfile({ history, location, staticContext, match, route }) {

    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);

    const onSubmit = () => {
        let {
            name: { value: usernameValue },
            // email: { value: emailValue },
            password: { value: passwordValue }, confirmPassword: { value: confirmPasswordValue },
            twitter: { value: twitterValue }, insta: { value: instaValue }, fb: { value: fbValue }
        } = state
        let input = { username: usernameValue, password: passwordValue, twitterProfile: twitterValue, instaProfile: instaValue, fbProfile: fbValue }
        let finalInput = { email: contextUser.email }

        for (let inputItem in input) {
            if (input[inputItem])
                finalInput[inputItem] = input[inputItem]
        }
        console.log(finalInput, 'finalInput')
        setUpdateUserVariables({ userInput: finalInput })
    }
    const [updateUserData, updateUserLoading, updateUserError, setUpdateUserVariables, setUpdateUserData] = useMutationApi(gql(UPDATE_USER_MUTATION))

    useEffect(() => {
        console.log(updateUserData, 'useEffect updateUserData')
        if (updateUserData) {
            let updateUser = updateUserData.data.updateUser
            // let [checkedItems, checkedPriority] = getCheckedItemsFromStore(updateUser)
            // setOption({ checkedItems, checkedPriority })
            storeUserInContext(updateUser)
        }
    }, [updateUserData])

    console.log(updateUserData, 'updateUserData')
    let [state, setState] = useState({
        name: { value: '', error: '', isError: false },
        // email: { value: '', error: '', isError: false },
        password: { value: '', error: '', isError: false },
        confirmPassword: { value: '', error: '', isError: false },
        twitter: { value: '', error: '', isError: false },
        insta: { value: '', error: '', isError: false },
        fb: { value: '', error: '', isError: false },
    })

    let [disable, setDisable] = useState(false)

    // const canDisableCreateProfile = () => {
    //     let extraData
    //     let bools = []
    //     for (let key of Object.keys(state)) {
    //         extraData = (key == 'confirmPassword') ? { formPassword: state.password } : null
    //         bools.push(getError(key, state[key] ? state[key].value : '', extraData))
    //     }
    //     // console.log(bools, 'canDisableCreateProfile')
    //     return !bools.reduce((acc, ele) => !ele.isError && acc, true)
    // }

    const canDisableUpdateProfile = () => {
        let extraData
        let bools = []
        for (let key of Object.keys(state)) {
            extraData = (key == 'confirmPassword') ? { formPassword: state.password } : null
            bools.push(getError(key, state[key] ? state[key].value : '', extraData))
        }
        // console.log(bools, 'canDisableCreateProfile')
        return !bools.reduce((acc, ele) => !ele.isError || acc, false)
    }

    useEffect(() => {
        setDisable(canDisableUpdateProfile())
    }, [state])

    const updateProfile = () => {
        if (!canDisableUpdateProfile()) {
            onSubmit()
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
                    {/* <Input id={'email'} type={'text'} isError={state['email'].isError} onBlur={(e) => handleChange('email', e.target.value)} placeholder={'Email'} /> */}
                    <Input id={'password'} type={'password'} isError={state['password'].isError} onBlur={(e) => handleChange('password', e.target.value)} placeholder={'Password'} />
                    <Input id={'confirmPassword'} type={'password'} isError={state['confirmPassword'].isError} onBlur={(e) => handleChange('confirmPassword', e.target.value)} placeholder={'Confirm Password'} />
                    <Input id={'twitter'} isError={state['twitter'].isError} onBlur={(e) => handleChange('twitter', e.target.value)} placeholder={'Twitter'} />
                    <Input id={'insta'} isError={state['insta'].isError} onBlur={(e) => handleChange('insta', e.target.value)} placeholder={'Instagram'} />
                    <Input id={'fb'} isError={state['fb'].isError} onBlur={(e) => handleChange('fb', e.target.value)} placeholder={'Facebook'} />
                    <Button disabled={disable} onClick={() => updateProfile()} width="200px">Update</Button>
                </PageContent>
            <Footer />
        </>
    )
}