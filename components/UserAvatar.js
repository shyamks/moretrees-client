import styled from 'styled-components'

const Username = styled.div`
    margin-right: 16px;
`

const Container =  styled.div`
    display: flex;
    flex-direction: row;
`

const Separator = styled.div`
    border-right: 1px solid green;
    height: 20px;
    margin-right: 20px;
`

const Logout = styled.div`
    &: hover{
        cursor: pointer;
    }
`
function UserAvatar({ userInfo, onLogout }) {
    return (
        <Container>
            <Username>{userInfo.username || userInfo.email}</Username>
            <Separator/>
            <Logout onClick={onLogout}>Logout</Logout>
        </Container>
    )
}

export default UserAvatar