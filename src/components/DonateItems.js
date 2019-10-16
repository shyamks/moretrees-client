import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react'
import { withRouter } from "react-router-dom"
import lodash from 'lodash'
import ReactMarkdown from 'react-markdown'
import { Collapse } from 'react-collapse'

import Button from './Button'
import Counter from './counter'
import { DONATION_MUTATION, GET_SAPLING_OPTIONS, RAZORPAY_KEY, MarkTitle } from '../constants'
import gql from 'graphql-tag'
import useMutationApi from './hooks/useMutationApi'
import useQueryApi from './hooks/useQueryApi'
import { showToast, apiCallbackStatus } from '../utils'
import UserContext from './UserContext'

import donateLogoImage from '../images/moretrees-donate-logo.png'
import projectsLogoImage from '../images/moretrees-projects-logo.png'
import roadProjectsLogoImage from '../images/moretrees-road-projects-logo.png'
import riverProjectsLogoImage from '../images/moretrees-river-projects-logo.png'
import Logger from './Logger'

const DONATION = 'donation'

const PAYMENT_CONFIRMATION = 'paymentConfirmation'
const PAYMENT_SUCCESS = 'paymentSuccess'

const Donate = styled.div`
    margin: 10px;
`

const DonateTrees = styled.div`
    text-align: center;
`
const DonateItemsContainer = styled.div`
    display: inline-block;
`
const DonateItem = styled.div`
    flex-direction: column;
    display: flex;
    margin-top: 12px;
    border-bottom: 1px solid grey;
    box-shadow: 0 4px 6px -6px #222;
`

const ItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    @media all and (max-width: 800px) {
        flex-direction: column;
    }
`

const ItemDetail = styled.div`
    margin: 0px 20px 25px 20px;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    display: flex;
    width: 50%;
    flex-direction: column;
    @media all and (max-width: 800px) {
        align-self: center;
    }
`

const ItemContent = styled.div`
    margin: 20px 10px 10px 10px;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    white-space:nowrap;
    display: flex;
`

const ItemTitle = styled.span`
    text-align: left;
    font-weight: bold;
    font-size: 22px;
    margin: 10px 10px 0px 10px;
    @media all and (max-width: 800px) {
        text-align: center;
    }
`

const ItemSubtitle = styled.div`
    text-align: left;
    margin: 10px 10px 0px 10px;
    @media all and (max-width: 800px) {
        text-align: center;
    }
`

const ItemCost = styled(ItemSubtitle)`
    font-weight: bold;
    font-size: 18px;
    width: 160px;
`

const CostContainer = styled.div`
    display: flex;
    @media all and (max-width: 800px) {
        align-self: center;
    }
`

const Section = styled.div`
    display: flex;
    flex-direction: column;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
    @media all and (max-width: 800px) {
        justify-content: center;
        align-items: center
    }
`

const MarkdownContainer = styled.div`
    margin-left: 20px;
    @media all and (max-width: 800px) {
        margin: 5px 0 0 5px;
    }
`

const CheckoutContainer = styled.div`
    margin-top: 20px;
`

const SectionLogo = styled.img`
    width: 55px;
    height: 50px;
    margin: 10px 5px 10px 10px;
    @media all and (max-width: 800px) {
        margin: 0 5px 0 0;
    }
`

const ProjectsTitleLogo = styled.img`
    width: 50px;
    height: 45px;
    margin: 10px;
`
const ProjectsLogo = styled.img`
    width: 50px;
    height: 45px;
    margin: 10px;
    @media all and (max-width: 800px) {
        align-self: center;
        margin: 10px 0 0 -5px;
    }
`

const Arrow = styled.div`
    &: hover {
        cursor: pointer;
    }
`

const ArrowSymbol = styled.i`
    border: solid black;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: ${(props) => props.up ? 'rotate(-135deg)' : 'rotate(45deg)'};
    -webkit-transform: ${(props) => props.up ? 'rotate(-135deg)' : 'rotate(45deg)'};
`

let itemCheckoutList = {}


function DonateItems({ staticContext }) {
    const { user: contextUser, storeUserInContext, removeUserInContext, authToken, setRegisterModal } = useContext(UserContext);
    const [setCalledStatus, checkCalledStatus] = apiCallbackStatus()
    const [modalStatus, setModalStatus] = useState({ status: false, type: PAYMENT_CONFIRMATION, data: null, getToken: null })

    Logger(staticContext,'staticContext')

    const [donationData, donationDataLoading, donationDataError, setDonationDataVariables, setDonationData] = useMutationApi(gql(DONATION_MUTATION))
    useEffect(() => {
        if (donationData && donationData.data && checkCalledStatus(DONATION)) {
            Logger(donationData, 'wtf payment')
            let referenceId = lodash.get(donationData, 'data.makeDonation.referenceId')
            let error = lodash.get(donationData, 'data.makeDonation.error') || donationDataError
            if (!error && referenceId) {
                setModalStatus({ type: PAYMENT_SUCCESS, status: true, data: referenceId })
                showToast('Donation successfull', 'success')
            }
            else {
                showToast('Problem occured while donating', 'error')
            }
        }
    }, [donationData, donationDataError])

    const [saplingOptionsData, isGetSaplingOptionsLoading, isGetSaplingOptionsError, refetchSaplingOptionsData] = useQueryApi(gql(GET_SAPLING_OPTIONS), { status: "ACTIVE" })
    useEffect(()=> {
        console.log('herererere')
        refetchSaplingOptionsData()
    },[])
    
    const saplingsArray = (saplingOptionsData && saplingOptionsData.getSaplingOptions) || (staticContext && staticContext.data && staticContext.data.data.getSaplingOptions) || []
    
    const [collapseMap, setCollapseMap] = useState({})
    useEffect(()=> {
        let saplingsArray = (saplingOptionsData && saplingOptionsData.getSaplingOptions) || []
        let map = saplingsArray.reduce((map, sapling) => { 
            map[sapling.id] = {collapse: true}
            return map
        }, {})
        setCollapseMap(map)
    }, [saplingOptionsData])

    const getPaymentInfo = () => {
        let email = (contextUser && contextUser.email) || ''
        let items = Object.values(itemCheckoutList).map((item) => lodash.pick(item, ['id', 'count', 'title']))
        let input = { email, amount: subTotalCheckoutCost, items }
        return { input, totalAmount: subTotalCheckoutCost }
    }

    const closeModal = () => {
        setModalStatus({ status: false, data: null, getToken: null })
    }

    

    const checkoutCostChanger = (count, val, item) => {
        itemCheckoutList[item.title] = { ...item, count }
        // Logger(count, itemCheckoutList, 'checkoutCounter');
        setSubTotalCheckoutCost(subTotalCheckoutCost + val);
    }

    let [subTotalCheckoutCost, setSubTotalCheckoutCost] = useState(0);

    const getRazorOptions = ({ amount, name, email }) => {
        const finalPayment = (token) => {
            if (!token) {
                showToast('Card info incorrect', 'error')
                closeModal()
                return
            }
            let email = (contextUser && contextUser.email) || ''
            let { input } = getPaymentInfo()
            input = { ...input, email, token: token.razorpay_payment_id }
            Logger(input, 'input finalPayment')
            setDonationDataVariables({ donationInput: input })
            setCalledStatus(true, DONATION)
            closeModal()
        }
        
        let razorOptions = {
            key: RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
            amount: amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
            currency: 'INR',
            name: 'Moretrees',
            description: 'Donation',
            // "image": "https://example.com/your_logo",
            // "order_id": "order_9A33XWu170gUtm",//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
            handler: function (response) {
                finalPayment(response)
            },
            prefill: {
                name,
                email
            },
            notes: {
                address: 'note value'
            },
            theme: {
                color: '#F37254'
            }
        }
        return razorOptions
    }

    const makePayment = () => {
        let email = contextUser && contextUser.email
        if (!email)
            setRegisterModal(true)
        else{
            if (subTotalCheckoutCost > 0) {
                let rzp1 = new window.Razorpay(getRazorOptions({ amount: subTotalCheckoutCost, email }))
                rzp1.open();
            }
            else{
                showToast('Make some selection', 'error')
            }
        }
        
    }

    const donateText = ` We will plant trees around you. We have projects coming up across 
                            cities & one of them is bound to be around where you live.
                            \n The saplings are maintained & watered by us for the critical first year.
                         \n\n We will notify you about progress through the plants life.
                         \n You get the geolocation & photo of your sapling once it is planted.`

    const getDonateItems = (items) => {
        let array = []
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            let { id, title, subtitle, content, remaining, type, cost } = item
            let logoType = (type == 'ROAD') ? roadProjectsLogoImage : riverProjectsLogoImage
            array.push(
                <DonateItem key={id}>
                    <ItemContainer>
                        <ProjectsLogo src={logoType} />
                        <ItemDetail>
                            <ItemTitle>{title}</ItemTitle>
                            <ItemSubtitle >{subtitle}</ItemSubtitle>

                            <Collapse isOpened={!(collapseMap[id] && collapseMap[id].collapse)}>
                                <ItemContent>
                                    <ReactMarkdown source={content} />
                                </ItemContent>
                            </Collapse>
                        </ItemDetail>
                        <CostContainer>
                            <ItemCost>{`Rs. ${cost} per tree`}</ItemCost>
                            <Counter maximumCount={remaining} itemCost={(count, itemChangeCost) => checkoutCostChanger(count, itemChangeCost, item)} cost={cost} />
                        </CostContainer>
                    </ItemContainer>
                    <Arrow onClick={() => setCollapseMap({ ...collapseMap, [id]: { collapse: !collapseMap[id].collapse } })}>
                        <ArrowSymbol up={collapseMap[id] ? !collapseMap[id].collapse : false} />
                    </Arrow>
                </DonateItem>
            )
        }
        return array
    }
    let donationItems = getDonateItems(saplingsArray)

    return (
        <Donate>
            <Section>
                <Container>
                    <SectionLogo src={donateLogoImage} />
                    <MarkTitle> Donate </MarkTitle>
                </Container>
                <MarkdownContainer>
                    <ReactMarkdown source={donateText} />
                </MarkdownContainer>
            </Section>
            <Section>
                <Container>
                    <ProjectsTitleLogo src={projectsLogoImage} />
                    <MarkTitle> Projects </MarkTitle>
                </Container>
                <MarkdownContainer>
                    <DonateTrees>
                        <DonateItemsContainer>
                            {donationItems}
                        </DonateItemsContainer>
                        <CheckoutContainer>
                            <Button disabled={subTotalCheckoutCost == 0} onClick={() => makePayment()}> Checkout </Button>
                        </CheckoutContainer>
                    </DonateTrees>

                </MarkdownContainer>
            </Section>
        </Donate>)
}
export default withRouter(DonateItems)