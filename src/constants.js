import styled from 'styled-components'

export const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql'
export const GRAPHQL_NOW_ENDPOINT = 'https://25c29412.ngrok.io/graphql'
export const FINAL_ENDPOINT = process.env.NODE_ENV == 'production' ? GRAPHQL_NOW_ENDPOINT : GRAPHQL_ENDPOINT
export const STRIPE_PUBLIC_KEY = 'pk_test_tixsUuAxi9ePUjNPmneQFJvy'
export const STRIPE_SECRET_KEY = 'sk_test_uFiRW5IFP6XK1mUm1f969jU0a'
export const POST = 'post'
export const GET = 'get'
export const STORE_TOKEN = 'authToken'
export const STORE_USER = 'loggedInUser'

export const PAGES = {
  INDEX: '/',
  DONATE: '/donate',
  VOLUNTEER: '/volunteer',
  MY_DONATIONS: '/myDonations',
  PROFILE: '/profile',
}

export const PageContent = styled.div`
    margin-top: 100px;
    width: 100%;
    height: auto;
    padding-bottom: 13rem;
`

export const Page = styled.div`
  position: relative;
  min-height: 100vh;
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
      type
      title
      subtitle
      cost
      content
      remaining
    }
}
`

export const REGISTER_MUTATION = `
mutation registerUser($username: String!, $email: String!, $password: String!) {
    registerUser(username: $username, email: $email, password: $password) {
      username
      email
      phone
      twitterProfile
      fbProfile
      instaProfile
      accessToken
      message
      error
    }
}`

export const LOGIN_QUERY = `
query loginUser($email: String!, $password: String!){
    loginUser(email: $email, password: $password) {
        username
        email
        phone
        twitterProfile
        fbProfile
        instaProfile
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
    phone
    twitterProfile
    fbProfile
    instaProfile
    availableWhen
    availableWhat
    message
    error
  }
}`

export const GET_USER_QUERY = `
query getUser($email: String!) {
  getUser(email: $email){
    username
    email
    phone
    twitterProfile
    fbProfile
    instaProfile
    availableWhen
    availableWhat
    message
    error
  }
}`

export const GET_MY_DONATIONS = `
query myDonations($email: String){
    myDonations(email: $email){
        id
        email
        amount
        items 
        createdAt
    }
}
`
