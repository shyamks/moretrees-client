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
const Button = styled.button`
        width: 30px;
        height: 30px;
        border-radius: 8px;
        outline: none;
    `
const TotalValue = styled.div`
        display: inline-block;
        width: 75px;
    `

const Container = styled.div`
        display: inline-table;
        flex-direction: row;
        border-radius: 5px;
        margin: 5px;
        min-width: 140px;
    `

export default function Counter({ maximumCount, cost, itemCost }) {
    let finalMaxCount = Math.min(maximumCount, MAX)

    let [counter, setCounter] = React.useState({ count: 0, totalCost: 0, actionValue: null })

    function chgCounter(val) {
        let counterVal = counter.count + val
        if (counterVal >= MIN && counterVal <= finalMaxCount) {
            setCounter({ count: counterVal, totalCost: counterVal * parseInt(cost), actionValue: val })
            // itemCost && itemCost(counterVal, val * parseInt(cost));
        }
    }

    React.useEffect(() => {
        let { count, totalCost, actionValue } = counter
        if (actionValue){
            itemCost && itemCost(count, actionValue * parseInt(cost))
        }
    }, [counter])


    
    return (
        <Container>
            <Button onClick={() => chgCounter(-1)}>-</Button>
            <TotalValue><span>{`Rs. ${counter.totalCost}`}</span></TotalValue>
            <Button onClick={() => chgCounter(1)}>+</Button>
        </Container>
    )
}