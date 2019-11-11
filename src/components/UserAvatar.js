import styled from 'styled-components'
import React from 'react'

const Username = styled.div`
    margin-right: 16px;
    &: hover{
        cursor: pointer;
    }
`

function UserAvatar({ userInfo, onEnter }) {
    return (
            <Username onKeyPress={(e) => onEnter(e)} onClick={(e) => onEnter(e)}>{userInfo.username || userInfo.email}</Username>
    )
}

export default UserAvatar