// import { Table } from 'react-bootstrap';

import styled from 'styled-components'
import Modal from 'react-modal'
import { useState, useContext, useRef } from 'react'
import { StripeProvider } from 'react-stripe-elements-universal';
import lodash from 'lodash'

import Input from './Input';
import Button from './Button';
import ItemCounter from './counter'
import { STRIPE_PUBLIC_KEY } from '../constants';
import Checkout from './checkout/Checkout';
import useLazyQueryApi from './hooks/useLazyQueryApi';
import gql from 'graphql-tag';
import useMutationApi from './hooks/useMutationApi';
import useQueryApi from './hooks/useQueryApi';
import { showToast } from '../utils';
import UserContext from './UserContext';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '30px',
        padding: '20px 20px 0 20px',
        border: '0px',
        boxShadow: '3px 3px 5px 6px #ccc'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }
}

const Donate = styled.div`
    text-align: center;
    margin-bottom: 20px;
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
const DonateItemsContainer = styled.div`
    width: 50%;
    margin: 40px auto auto auto;
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
    width: 50%;
    margin: auto;
`

const ModalText = styled.div`
    text-align: center;
    vertical-align: middle;
`

function getDonateItems(items, checkoutCostChanger) {
    let donateItems = [];

    for (let item of items) {
        let id = item.id, cost = item.saplingCost, name = item.saplingName, image = item.saplingImage, remaining = item.remainingCount;
        donateItems.push(
            <DonateItem key={id}>
                <ItemAvatar>
                    <img style={{ width: 100, height: 100, borderRadius: 50 }} src={image} alt="boohoo" className="img-responsive" />
                </ItemAvatar>
                <ItemDetail>
                    <ItemName>{name}</ItemName>
                    <ItemCost> Rs {cost}</ItemCost>
                </ItemDetail>
                <ItemCounter itemCost={(count, itemChangeCost) => checkoutCostChanger(count, itemChangeCost, item)} cost={cost} />
            </DonateItem>
        )
    }
    return donateItems;
}

const PAYMENT_MUTATION = gql`
mutation makeDonation($donationInput : DonationPaymentInput) {
    makeDonation(input: $donationInput){
      status
      error
    }
}`

const GET_SAPLING_OPTIONS = gql`
query getSaplingOptions($status: String){
    getSaplingOptions(status: $status){
        id
        status
        saplingName
        saplingImage
        saplingCost
        remainingSaplings
    }
}
`
let itemCheckoutList = {}

function DonateItems() {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken } = useContext(UserContext);

    let [donateStatus, setDonateStatus] = useState({ status: false, donateAmount: 0 })
    let [modalStatus, setModalStatus] = useState({ status: false, getToken: null })
    let donateRef = useRef(null)

    const [paymentData, paymentDataLoading, paymentDataError, setPaymentDataVariables, setPaymentData] = useMutationApi(PAYMENT_MUTATION)
    const [saplingOptionsData, isGetSaplingOptionsLoading, isGetSaplingOptionsError, refetchSaplingOptionsData] = useQueryApi(GET_SAPLING_OPTIONS, { status: "ACTIVE" })
    const saplingsArray = (saplingOptionsData && saplingOptionsData.getSaplingOptions) || []

    const getPaymentInfo = () => {
        let donateAmount = donateStatus.donateAmount
        let email = (contextUser && contextUser.email) || ""
        let items = Object.values(itemCheckoutList).map((item) => lodash.pick(item, ['id', 'count', 'saplingName']))
        let input = { email, amount: subTotalCheckoutCost, donationAmount: donateAmount, items }
        return { input, totalAmount: subTotalCheckoutCost + donateAmount }
    }

    const makePaymentFromToken = async (getToken) => {
        let { totalAmount } = getPaymentInfo()
        if (totalAmount)
            setModalStatus({ status: true, getToken })
        else
            showToast('Make some selection', 'error')
    }

    const doIt = () => {
        const finalAmount = parseInt(donateRef.current.value);
        if (finalAmount >= 20)
            setDonateStatus({ status: true, donateAmount: finalAmount })
    }

    const finalPayment = async () => {
        let getToken = modalStatus.getToken
        let token = await getToken()
        if (!token) {
            showToast('Card info incorrect', 'error')
            return
        }
        let email = (contextUser && contextUser.email) || ''
        let { input } = getPaymentInfo()
        input = { ...input, email, token: token.id }
        console.log(input, 'input')
        setPaymentDataVariables({ donationInput: input })
        setModalStatus({ status: false, getToken: null })
    }

    function checkoutCostChanger(count, val, item) {
        itemCheckoutList[item.saplingName] = { ...item, count }
        console.log(count, itemCheckoutList, 'checkoutCounter');
        setSubTotalCheckoutCost(subTotalCheckoutCost + val);
    }

    let [subTotalCheckoutCost, setSubTotalCheckoutCost] = useState(0);

    return (
        <Donate>
            <Modal isOpen={modalStatus.status}
                onAfterOpen={() => { }}
                onRequestClose={() => setModalStatus({ status: false, getToken: null })}
                style={customStyles}
                contentLabel={'Hey Man'}
            >
                <div>
                    <ModalText>
                        Lets make a total donation of Rs {getPaymentInfo().totalAmount}
                    </ModalText>
                    <Button onClick={() => finalPayment()}>Go ahead</Button>

                </div>
            </Modal>
            
            <DonateTrees>
                <DonateItemsContainer>
                    {getDonateItems(saplingsArray, checkoutCostChanger)}
                </DonateItemsContainer>
                <Subtotal> Subtotal: Rs {subTotalCheckoutCost}</Subtotal>
            </DonateTrees>
            <Or>
                OR
            </Or>
            <DonateMoney>
                {
                    donateStatus.status ?
                        <>
                            <>I would like to donate Rs {donateStatus.donateAmount}</>
                            <Button onClick={() => setDonateStatus({ status: false, donateAmount: 0 })}> Reset </Button>
                        </> :
                        <>
                            <MoneyLine>You could choose the amount you want to donate.</MoneyLine>
                            <Input ref={donateRef} numberInputWidth={'50px'} type="number" defaultValue={20} />
                            <Button onClick={() => { doIt() }}> Lets do it! </Button>
                        </>
                }
            </DonateMoney>
            <StripeProvider apiKey={STRIPE_PUBLIC_KEY}>
                <Checkout onSubmit={(getToken) => makePaymentFromToken(getToken)} />
            </StripeProvider>
        </Donate >
    )
}

export default DonateItems;