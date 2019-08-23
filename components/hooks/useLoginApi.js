import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useState, useEffect } from 'react'
import gql from 'graphql-tag';

function useLoginApi() {
    const LOGIN_QUERY = gql`
    query loginUser($email: String!, $password: String!){
        loginUser(email: $email, password: $password) {
          username
          email
          accessToken
          message
          error
        }
    }`
    const [loginData, setLoginData] = useState(null)
    const [details, setDetails] = useState(null)
    const [getLoginData, { loading, data, error }] = useLazyQuery(LOGIN_QUERY)
    useEffect(() => {
        const login = async () => {
            if (details) {
                let { email, password } = details
                console.log('email',email, this)
                getLoginData({ variables: { email, password } })
                setDetails(null)
            }
        }
        login()
    }, [details])

    useEffect(() => {
        setLoginData(data)
    }, [data])
    return [loginData, loading, error, setDetails, setLoginData]
}

export default useLoginApi