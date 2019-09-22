import styled from 'styled-components'
import React from 'react'

const Username = styled.div`
    margin-right: 16px;
`

const Container =  styled.div`
    display: flex;
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
        <>
            <Username>{userInfo.username || userInfo.email}</Username>
            <Separator/>
            <Logout onClick={onLogout}>Logout</Logout>
        </>
    )
}

export default UserAvatar