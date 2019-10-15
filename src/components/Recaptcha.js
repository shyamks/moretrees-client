import React from 'react'
import Recaptcha from 'react-recaptcha'
import { isProd } from '../constants'

export function Captcha({ onSuccess }) {

    const verifyCallback = (response) => {
        if (response) {
            onSuccess(response)
        }
    }
    return (
        <>
        { isProd ? 
            (<Recaptcha
                sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY}
                render="explicit"
                verifyCallback={verifyCallback}
            />) : <div/>
        }
        </>
    )
}