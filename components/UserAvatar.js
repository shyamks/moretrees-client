import store from 'store'

function UserAvatar({ userInfo, onLogout }) {
    return (
        <React.Fragment>
            <div>{userInfo.email}</div>
            <div onClick={onLogout}>Logout</div>
        </React.Fragment>
    )
}

export default UserAvatar