import { useState } from 'react'
import styled from 'styled-components'


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
                let text = `${item.label}`;
                return (
                    <ListItem id={item.key}>
                       <div>{itemNumber}</div>
                       <div>{text}</div>
                    </ListItem>
                )
            })}
        </List>
    )
}

export default PriorityList