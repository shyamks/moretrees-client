import styled from 'styled-components'

export const isProd = process.env.RAZZLE_RUNTIME_NODE_ENV == 'production'
export const FINAL_ENDPOINT = isProd ? process.env.RAZZLE_RUNTIME_PROD_ENDPOINT : process.env.RAZZLE_RUNTIME_TEST_ENDPOINT
export const RAZORPAY_KEY = isProd ? process.env.RAZZLE_RUNTIME_RAZORPAY_PROD_KEY : process.env.RAZZLE_RUNTIME_RAZORPAY_TEST_KEY
export const IMGUR_KEY = process.env.RAZZLE_RUNTIME_IMGUR_CLIENT_ID
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
  ADMIN: '/admin',
  FORGOT_PASSWORD: '/forgotPassword',
  RESET: '/reset'
}

export const UserType = {
  ADMIN: 'admin'
}

export const TREE_STATUS = {
  PLANTED: 'PLANTED',
  PENDING: 'PENDING'
}
export const availableWhenOptions = [
  { value: 'Weekdays', label: 'Weekdays' },
  { value: 'Weekends', label: 'Weekends' },
  { value: 'Any day', label: 'Any day' },
]
export const availableWhatOptions = [
  { value: 'Plant trees with us', label: 'Plant trees with us' },
  { value: 'Scout locations to plant trees for us', label: 'Scout locations to plant trees for us' },
  { value: 'Help us launch your city', label: 'Help us launch your city' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Website', label: 'Website' },
]
export const adminOptions = [
  { value: 'Users', label: 'Users' },
  { value: 'Users Donated', label: 'Users Donated' },
  { value: 'Donate Items', label: 'Donate Items' }
]
export const donationTypes = [
  { value: 'RIVER', label: 'RIVER' },
  { value: 'ROAD', label: 'ROAD' },
]
export const PageContent = styled.div`
    margin-top: 70px;
    width: 100%;
    height: auto;
    padding-bottom: 13rem;
`

export const Page = styled.div`
  position: relative;
  min-height: 100vh;
`

export const MarkTitle = styled.h3`
  font-weight: 700 !important;
  margin-top: 20px;
  @media all and (max-width: 800px) {
  }
`

export const DONATION_MUTATION = `
mutation makeDonation($donationInput : DonationPaymentInput) {
    makeDonation(input: $donationInput){
      status
      error
      referenceId
    }
}`

export const GET_PROJECTS = `
query getProjects($status: String){
  getProjects(status: $status){
      id
      type
      title
      subtitle
      cost
      content
      remaining
      status
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
      twitterId
      instaId
      fbProfile
      instaProfile
      accessToken
      message
      error
    }
}`

export const RESET_PASSWORD_MUTATION = `
mutation resetPassword($password: String!, $confirmPassword: String!, $token: String!) {
  resetPassword(password: $password, confirmPassword: $confirmPassword, token: $token) {
    status
    error
  }
}
`

export const CONFIRM_TOKEN_QUERY = `
query confirmToken($token: String!){
  confirmToken(token: $token){
    status
    error
  }
}
`

export const LOGIN_QUERY = `
query loginUser($email: String!, $password: String!){
    loginUser(email: $email, password: $password) {
        username
        email
        type
        phone
        twitterProfile
        twitterId
        instaId
        fbProfile
        instaProfile
        accessToken
        message
        error
    }
}`

export const FORGOT_PASSWORD_QUERY = `
query forgotPassword($email: String!) {
  forgotPassword(email: $email) {
    status
    error
  }
}
`

export const UPDATE_USER_MUTATION = `
mutation updateUser($userInput: UserInput!) {
  updateUser(input: $userInput){
    username
    email
    type
    phone
    twitterProfile
    twitterId
    instaId
    fbProfile
    instaProfile
    availableWhen
    availableWhat
    message
    error
  }
}`

export const UPDATE_USERS_MUTATION = `
mutation updateUsers($userInput: [UserInput]!, $email: String, $twitterId: String, $instaId: String) {
  updateUsers(input: $userInput, email: $email, twitterId: $twitterId, instaId: $instaId){
    response {
      username
      email
      type
      phone
      twitterProfile
      twitterId
      instaId
      fbProfile
      instaProfile
      availableWhen
      availableWhat
      message
      error
    }
    status
    error
  }
}`

export const UPDATE_PROJECTS_MUTATION = `
mutation updateSaplings($saplingInput: [UpdateSaplingsInput]!, $email: String, $twitterId: String, $instaId: String) {
  updateSaplings(input: $saplingInput, email: $email, twitterId: $twitterId, instaId: $instaId){
    response {
      id
      type
      title
      subtitle
      cost
      content
      remaining
      status
    }
    status
    error
  }
}`

export const GET_USER_QUERY = `
query getUser($email: String, $twitterId: String, $instaId: String) {
  getUser(email: $email, twitterId: $twitterId, instaId: $instaId){
    username
    email
    phone
    twitterProfile
    twitterId
    instaId
    fbProfile
    instaProfile
    availableWhen
    availableWhat
    message
    error
  }
}`

export const GET_ALL_USERS = `
query getAllUsers($email: String, $twitterId: String, $instaId: String) {
  getAllUsers(email: $email, twitterId: $twitterId, instaId: $instaId){
    id
    username
    email
    phone
    twitterProfile
    twitterId
    instaId
    fbProfile
    instaProfile
    availableWhen
    availableWhat
    message
    error
  }
}`

export const GET_ALL_USER_DONATIONS = `
query getAllUserDonations($email: String, $twitterId: String, $instaId: String) {
  getAllUserDonations(email: $email, twitterId: $twitterId, instaId: $instaId){
    email
    instaProfile
    twitterProfile
    type
    title
    subtitle
    cost
    content
    treeId
    status
    photoTimeline {
      order
      text
      photoUrl
    }
    createdAt
  }
}`


export const GET_MY_DONATIONS = `
query myDonations($email: String, $twitterId: String, $instaId: String) {
    myDonations(email: $email, twitterId: $twitterId, instaId: $instaId){
      email
      instaProfile
      twitterProfile
      type
      title
      subtitle
      cost
      content
      treeId
      status
      photoTimeline {
        order
        text
        photoUrl
      }
      createdAt
    }
}
`

export const ADD_NEW_PHOTO_MUTATION = `
mutation addPhotoToTimeline($input: PhotoTimelineInput, $email: String, $twitterId: String, $instaId: String) {
    addPhotoToTimeline(input: $input, email: $email, twitterId: $twitterId, instaId: $instaId) {
      email
      instaProfile
      twitterProfile
      type
      title
      subtitle
      cost
      content
      treeId
      status
      photoTimeline {
        order
        text
        photoUrl
      }
      createdAt
    }
}
`
