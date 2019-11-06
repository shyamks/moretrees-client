import styled from 'styled-components'

export const isProd = process.env.NODE_ENV == 'production'
export const FINAL_ENDPOINT = isProd ? process.env.RAZZLE_RUNTIME_PROD_ENDPOINT : process.env.RAZZLE_RUNTIME_TEST_ENDPOINT
export const RAZORPAY_KEY = isProd ? process.env.RAZZLE_RUNTIME_RAZORPAY_PROD_KEY : process.env.RAZZLE_RUNTIME_RAZORPAY_TEST_KEY
export const IMGUR_KEY = process.env.RAZZLE_RUNTIME_IMGUR_CLIENT_ID
export const POST = 'post'
export const GET = 'get'
export const STORE_TOKEN = 'authToken'
export const STORE_USER = 'loggedInUser'
export const RESPONSE_SUCCESS = 'success'
export const RESPONSE_ERROR = 'error'

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

export const PLANT_STATUS_OPTIONS = [
  { value: 'PLANTED', label: 'PLANTED' },
  { value: 'PENDING', label: 'PENDING' }
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
      responseStatus {
        text
        status
      }
    }
}`

export const GET_PROJECTS = `
query getProjects($status: String){
  getProjects(status: $status){
      projects {
        id
        type
        title
        subtitle
        cost
        content
        remaining
        status
      }  
      responseStatus {
        text
        status
      }
    }
}
`

export const IS_EMAIL_AVAILABLE = `
query isEmailAvailable($email: String){
  isEmailAvailable(email: $email){
    email
    emailAvailable
    responseStatus {
      text
      status
    }
  }
}
`

export const REGISTER_MUTATION = `
mutation registerUser($username: String!, $email: String!, $password: String!, $phone: String!) {
    registerUser(username: $username, email: $email, password: $password, phone: $phone) {
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
      responseStatus {
        text
        status
      }
    }
}`

export const RESET_PASSWORD_MUTATION = `
mutation resetPassword($password: String!, $confirmPassword: String!, $token: String!) {
  resetPassword(password: $password, confirmPassword: $confirmPassword, token: $token) {
    status
    error
    responseStatus {
      text
      status
    }
  }
}
`

export const CONFIRM_TOKEN_QUERY = `
query confirmToken($token: String!){
  confirmToken(token: $token){
    email
    responseStatus {
      text
      status
    }
  }
}
`

export const LOGIN_QUERY = `
query loginUser($email: String, $password: String){
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
        responseStatus {
          text
          status
        }
    }
}`

export const FORGOT_PASSWORD_QUERY = `
query forgotPassword($email: String!) {
  forgotPassword(email: $email) {
    status
    error
    responseStatus {
      text
      status
    }
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
    responseStatus {
      text
      status
    }
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
    responseStatus {
      text
      status
    }
  }
}`

export const UPDATE_PROJECTS_MUTATION = `
mutation updateProjects($saplingInput: [UpdateProjectsInput]!, $email: String, $twitterId: String, $instaId: String) {
  updateProjects(input: $saplingInput, email: $email, twitterId: $twitterId, instaId: $instaId){
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
    responseStatus {
      text
      status
    }
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
    responseStatus {
      text
      status
    }
  }
}`

export const GET_ALL_USERS = `
query getAllUsers($email: String, $twitterId: String, $instaId: String) {
  getAllUsers(email: $email, twitterId: $twitterId, instaId: $instaId){
    users {
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
    responseStatus {
      text
      status
    }
  }
}`

export const GET_ALL_USER_DONATIONS = `
query getAllUserDonations($email: String, $twitterId: String, $instaId: String) {
  getAllUserDonations(email: $email, twitterId: $twitterId, instaId: $instaId){
    allDonations {
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
    responseStatus {
      text
      status
    }
  }
}`


export const GET_MY_DONATIONS = `
query myDonations($email: String, $twitterId: String, $instaId: String) {
    myDonations(email: $email, twitterId: $twitterId, instaId: $instaId){
      myDonations {
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
      responseStatus {
        text
        status
      }
    }
}
`

export const ADD_NEW_PHOTO_MUTATION = `
mutation addPhotoToTimeline($input: PhotoTimelineInput, $email: String, $twitterId: String, $instaId: String) {
    addPhotoToTimeline(input: $input, email: $email, twitterId: $twitterId, instaId: $instaId) {
      myDonation {
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
      responseStatus {
        text
        status
      }
    }
}
`

export const UPDATE_USER_DONATION_MUTATION = `
mutation updateUserDonations($input: [UpdateUserDonationInput]!, $email: String, $twitterId: String, $instaId: String) {
    updateUserDonations(input: $input, email: $email, twitterId: $twitterId, instaId: $instaId) {
      allDonations {
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
      responseStatus {
        text
        status
      }
    }
}
`
