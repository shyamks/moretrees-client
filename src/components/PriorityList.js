import { useState } from 'react'
import styled from 'styled-components'
import React from 'react';

const List = styled.div`
    display: inline-block;
    word-wrap: break-word;
    margin: 15px;
`

const ListItem = styled.div`
    margin: 15px;
    display: flex;
`
function PriorityList({ items }) {
    return (
        <List>
            {items.map((item, index) => {
                let itemNumber = `${(index + 1)}.`
                let text = `${item.optionText}`;
                return (
                    <ListItem key={item.id}>
                       <div>{itemNumber}</div>
                       <div>{text}</div>
                    </ListItem>
                )
            })}
        </List>
    )
}

export default PriorityList