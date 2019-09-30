import React, { useState } from 'react'
import styled from 'styled-components'
import Input from './Input'

const MIN = 0
const MAX = 9

let InputContainer = styled.span`
    margin-top: -25px;
    &:hover {
        cursor: pointer
    }
`

export default function Counter({ maximumCount, cost, itemCost }) {
    let finalMaxCount = Math.min(maximumCount, MAX)

    let [counter, setCounter] = React.useState({ count: 0, totalCost: 0, actionValue: null })

    function chgCounter(val) {
        let counterVal = counter.count + val
        console.log(val, counter, finalMaxCount, 'chgCounter')
        if (counterVal >= MIN && counterVal <= finalMaxCount) {
            console.log(val, 'val')
            setCounter({ count: counterVal, totalCost: counterVal * parseInt(cost), actionValue: val })
            // itemCost && itemCost(counterVal, val * parseInt(cost));
        }
    }

    React.useEffect(() => {
        let { count, totalCost, actionValue } = counter
        if (actionValue){
            console.log(counter, parseInt(cost), 'wjat')
            itemCost && itemCost(count, actionValue * parseInt(cost))
        }
    }, [counter])


    const Button = styled.button`
        width: 30px;
        height: 30px;
        border-radius: 8px;
    `
    const TotalValue = styled.span`
        margin: 0px 12px 0 12px;
    `

    const Container = styled.div`
        display: inline-table;
        flex-direction: row;
        border-radius: 5px;
        margin: 5px;
    `
    return (
        <Container>
            <Button onClick={() => chgCounter(-1)}>-</Button>
            <TotalValue>{`Rs. ${counter.totalCost}`}</TotalValue>
            <Button onClick={() => chgCounter(1)}>+</Button>
        </Container>
    )
}