import React from 'react'
import Recaptcha from 'react-recaptcha'
import { isProd } from '../constants'

export function Captcha({ onSuccess }) {

    const verifyCallback = (response) => {
        if (response) {
            onSuccess(response)
        }
    }
    let showCaptcha = Boolean(process.env.RAZZLE_RUNTIME_DISABLE_CAPTCHA)
    return (
        <>
        { showCaptcha &&
            (<Recaptcha
                sitekey={process.env.RAZZLE_RUNTIME_CAPTCHA_SITE_KEY}
                render="explicit"
                verifyCallback={verifyCallback}
            />) 
        }
        </>
    )
}