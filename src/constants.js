import styled from 'styled-components'

export const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql'
export const GRAPHQL_NOW_ENDPOINT = 'https://4815d6f9.ngrok.io/graphql'
export const FINAL_ENDPOINT = process.env.NODE_ENV == 'production' ? GRAPHQL_NOW_ENDPOINT : GRAPHQL_ENDPOINT
export const STRIPE_PUBLIC_KEY = 'pk_test_tixsUuAxi9ePUjNPmneQFJvy'
export const STRIPE_SECRET_KEY = 'sk_test_uFiRW5IFP6XK1mUm1f969jU0a'
export const POST = 'post'
export const GET = 'get'
export const STORE_TOKEN = 'authToken'
export const STORE_USER = 'loggedInUser'

export const PageContent = styled.div`
    margin-top: 100px;
    width: 100%;
    height: auto;
`

export const DONATION_MUTATION = `
mutation makeDonation($donationInput : DonationPaymentInput) {
    makeDonation(input: $donationInput){
      status
      error
      referenceId
    }
}`

export const GET_SAPLING_OPTIONS = `
query getSaplingOptions($status: String){
    getSaplingOptions(status: $status){
        id
        status
        saplingName
        saplingImage
        saplingCost
        remainingSaplings
    }
}
`

export const REGISTER_MUTATION = `
    mutation registerUser($username: String!, $email: String!, $password: String!) {
        registerUser(username: $username, email: $email, password: $password) {
            username
            email
            error
            message
        }
    }`

export const LOGIN_QUERY = `
    query loginUser($email: String!, $password: String!){
        loginUser(email: $email, password: $password) {
            username
            email
            phone
            bio
            industry
            role
            volunteerOptions {
              optionText
              id
              status
            }
            accessToken
            message
            error
        }
    }`

export const GET_VOLUNTEER_QUERY = `
    query getVolunteerOptions($status: String){
        getVolunteerOptions(status: $status) {
            optionText
            status
            id
        }
  }`

export const UPDATE_USER_MUTATION = `
    mutation updateUser($userInput: UserInput!) {
      updateUser(input: $userInput){
        username
        email
        bio
        phone
        industry
        volunteerOptions {
          optionText
          id
          status
        }
        error
        message
      }
    }`

export const GET_USER_QUERY = `
    query getUser($email: String!) {
      getUser(email: $email){
        username
        email
        bio
        phone
        industry
        volunteerOptions {
          optionText
          id
          status
        }
        error
        message
      }
    }`

export const GET_MY_DONATIONS = `
    query myDonations($email: String){
        myDonations(email: $email){
            id
            email
            amount
            donationAmount
            items 
            createdAt
        }
    }
`
