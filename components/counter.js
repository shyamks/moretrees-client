import { useState } from 'react'
import styled from 'styled-components'
import Input from './Input'

const MIN = 0
const MAX = 9

let CounterContainer = styled.div`
    display: flex;
    flex-direction: horizontal;
`
let Minus = styled.span`
    margin: 30px 5px 0 0;
    height: 20px;
    &:hover {
        cursor: pointer
    }
`

let Plus = styled.span`
    margin: 30px 0 0 5px;
    height: 20px;
    &:hover {
        cursor: pointer
    }
`

let TotalCost = styled.div`
    margin: 30px 60px 00px 60px;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    white-space:nowrap;
`

function Counter({ maximumCount, cost, itemCost }) {
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
            <Minus onClick={() => chgCounter(-1)}> - </Minus>
            <Input numberInputWidth={'12px'} value={count}></Input>
            <Plus onClick={() => chgCounter(1)}> + </Plus>
            <TotalCost> Rs {totalCost}</TotalCost>
        </CounterContainer>
    )
}
export default Counter;