import { useState } from 'react'
import React from 'react';
import styled from 'styled-components'
import Input from './Input'

const MIN = 0
const MAX = 9

let CounterContainer = styled.div`
    display: flex;
    text-align: center;
    justify-content: space-between;
    margin: 25px 0 25px 0;
    padding-left: 40px;
    width: 100px;
`

let Container = styled.div`
    display: flex;
`
let Minus = styled.span`
    margin: 0 5px 0 0;
    height: 20px;
    &:hover {
        cursor: pointer
    }
`

let InputContainer = styled.span`
    margin-top: -25px;
    &:hover {
        cursor: pointer
    }
`

let Plus = styled.span`
    margin: 0 0 0 5px;
    height: 20px;
    &:hover {
        cursor: pointer
    }
`

let TotalCost = styled.div`
    margin: 0px 60px 0px 60px;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    white-space:nowrap;
`

function Counter({ maximumCount, cost, itemCost }) {
    console.log(maximumCount, 'lol')

    let finalMaxCount = Math.min(maximumCount, MAX)

    function chgCounter(val) {
        let counterVal = count + val
        if (counterVal >= MIN && counterVal <= finalMaxCount) {
            setCount(counterVal)
            setTotalCost(counterVal * cost)
            itemCost(counterVal, val * cost);
        }
    }
    let [count, setCount] = useState(0)

    let [totalCost, setTotalCost] = useState(0)
    return (
        <CounterContainer>
            <Container>
                <Minus onClick={() => chgCounter(-1)}> - </Minus>
                <InputContainer><Input numberInputWidth={'12px'} value={count}></Input></InputContainer>
                <Plus onClick={() => chgCounter(1)}> + </Plus>
            </Container>
            <TotalCost> Rs {totalCost}</TotalCost>
        </CounterContainer>
    )
}
export default Counter;