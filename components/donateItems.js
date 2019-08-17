// import { Table } from 'react-bootstrap';

import styled from 'styled-components'
import {useState} from 'react'

import ItemCounter from './counter'

let items = [
    {
        url: "https://avatars3.githubusercontent.com/u/7412845?s=400&u=7fa4316e982391d46c84536eb54b375439e97f7b&v=4",
        name: 'Peepal sapling',
        id: 1,
        cost: 500,
        number: 1
    },
    {
        url: "https://avatars3.githubusercontent.com/u/7412845?s=400&u=7fa4316e982391d46c84536eb54b375439e97f7b&v=4",
        name: 'Peanut sapling',
        id: 2,
        cost: 100,
        number: 1
    }
]
const Donate = styled.div`

`

const DonateTrees = styled.div`

`



const Or = styled.div`
    text-align: center;
    margin: 30px;
`
const DonateMoney = styled.div`
    text-align: center;
    display:flex;
    flex-direction: column;
    align-items: center;
`

const MoneyLine = styled.div`

`
const MoneyInput = styled.input`
    width: 40px;
    margin: 5px;
`

const DonateItem = styled.div`
    display: flex;
    flex-direction: horizontal;
`
const ItemAvatar = styled.div`
    margin: 10px;
`

const ItemDetail = styled.div`
    margin: 25px 60px 25px 60px;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    white-space:nowrap;
`

const ItemName = styled.span`
    font-style: bold;
    margin: 10px 10px 0px 10px;
`

const ItemCost = styled.div`
    font-style: italic;
    font-size: 12px;
    text-align:center;
`

const Subtotal = styled.div`
    display: flex;
    width: 50%;
    flex-direction: row-reverse;
`


function getDonateItems(items, checkoutCostChanger) {
    let donateItems = [];
    
    for (let item of items) {
        donateItems.push(
            <DonateItem key={item.id}>
                <ItemAvatar>
                    <img style={{ width: 100, height: 100, borderRadius: 50 }} src={item.url} alt="boohoo" className="img-responsive" />
                </ItemAvatar>
                <ItemDetail>
                    <ItemName>{item.name}</ItemName>
                    <ItemCost> Rs {item.cost}</ItemCost>
                </ItemDetail>
                <ItemCounter itemCost={(itemChangeCost) => checkoutCostChanger(itemChangeCost)} cost={item.cost}/>
            </DonateItem>
        )
    }
    return donateItems;
}

function DonateItems() {
    function checkoutCostChanger(val){
        setSubTotalCheckoutCost(subTotalCheckoutCost + val );
    }
    let [subTotalCheckoutCost, setSubTotalCheckoutCost] = useState(0);
    return (
        <Donate>
            <DonateTrees>
                <div>
                    {getDonateItems(items, checkoutCostChanger)}
                </div>
                 <Subtotal> Subtotal: Rs {subTotalCheckoutCost}</Subtotal>
            </DonateTrees>
                <Or>
                    OR
                </Or>
            <DonateMoney>
                 <MoneyLine>You could choose the amount you want to donate.</MoneyLine>
                 <MoneyInput type="number" defaultValue={0} onChange={(event)=> {
                     let val = parseInt(event.target.value) || 0;
                     checkoutCostChanger(val)}}/>
            </DonateMoney>
        </Donate>
    )
}

export default DonateItems;