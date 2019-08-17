import { useState } from 'react'
import styled from 'styled-components'

const MIN = 0
const MAX = 9

let CounterContainer = styled.div`
    margin: 30px;
    display: flex;
    flex-direction: horizontal;
`
let Minus = styled.span`
    height: 20px;
    &:hover {
        cursor: pointer
    }
`
let Input = styled.input`
    width: 8px;
    height: 15px;
    text-align: center;
    margin: 0px 5px 0px 7px;
    white-space: nowrap;
`
let Plus = styled.span`
    height: 20px;
    &:hover {
        cursor: pointer
    }
`

let TotalCost = styled.div`
    margin: 0px 60px 00px 60px;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    white-space:nowrap;
`

function Counter(props) {
    let cost = props.cost;
    let itemCost = props.itemCost;
    function chgCounter(val) {
        let counterVal = count + val
        if (counterVal >= MIN && counterVal <= MAX) {
            setCount(counterVal)
            setTotalCost(counterVal * cost)
            itemCost(val * cost);
        }
    }
    let [count, setCount] = useState(0)

    let [totalCost, setTotalCost] = useState(0)
    return (
        <CounterContainer>
            <Minus onClick={() => chgCounter(-1)}> - </Minus>
            <Input value={count}></Input>
            <Plus onClick={() => chgCounter(1)}> + </Plus>
            <TotalCost> Rs {totalCost}</TotalCost>
        </CounterContainer>
    )
}
export default Counter;