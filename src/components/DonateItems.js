import styled from 'styled-components'
import React from 'react'
import { useState, useContext, useEffect, useRef } from 'react'
import { withRouter } from "react-router-dom"
import lodash from 'lodash'
import ReactMarkdown from 'react-markdown'
import { Collapse } from 'react-collapse'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Button from './Button'
import Counter from './counter'
import { DONATION_MUTATION, GET_PROJECTS, RAZORPAY_KEY, MarkTitle, RESPONSE_SUCCESS } from '../constants'
import gql from 'graphql-tag'
import useMutationApi from './hooks/useMutationApi'
import useQueryApi from './hooks/useQueryApi'
import { showToast } from '../utils'
import UserContext from './UserContext'

import donateLogoImage from '../images/moretrees-donate-logo.png'
import projectsLogoImage from '../images/moretrees-projects-logo.png'
import roadProjectsLogoImage from '../images/moretrees-road-projects-logo.png'
import riverProjectsLogoImage from '../images/moretrees-river-projects-logo.png'
import Logger from './Logger'

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
    border-bottom: 1px solid grey;
    box-shadow: 0 4px 6px -6px #222;
`

const ItemContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 5px;
`

const ItemDetail = styled.div`
    margin: 0px 20px 5px 20px;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    display: flex;
    width: 50%;
    flex-direction: column;
    @media all and (max-width: 800px) {
        align-self: center;
        margin: 0px 10px 5px 10px;
    }
`

const ItemContent = styled.div`
    margin: 20px 10px 10px 10px;
    font-family: "Trebuchet MS", Helvetica, sans-serif;
    text-align: initial;
    `

const ItemTitle = styled.span`
    text-align: left;
    font-weight: bold;
    font-size: 22px;
    margin: 10px 10px 0px 10px;
    @media all and (max-width: 800px) {
        font-size: 14px;
        text-align: center;
    }
`

const ItemSubtitle = styled.p`
    margin: 10px 10px 10px 10px;
    text-align: left;
`

const ItemCost = styled(ItemSubtitle)`
    font-weight: bold;
    width: 160px;
    @media all and (max-width: 800px) {
        width: 100px;
    }
`

const CostContainer = styled.div`
    display: flex;
    @media all and (max-width: 800px) {
        align-items: center;
        flex-direction: column;
    }
`

const Section = styled.div`
    display: flex;
    flex-direction: column;
`

const Container = styled.div`
    display: flex;
    flex-direction: row;
`

const MarkdownContainer = styled.div`
    margin: -5px 0 0 20px;
    flex-direction: column;
    @media all and (max-width: 800px) {
        margin: 0 0 0 5px;
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
        margin: 7px 5px 0 -5px;
    }
`

const ProjectsTitleLogo = styled.img`
    width: 50px;
    height: 45px;
    margin: 10px;
    @media all and (max-width: 800px) {
        margin: 8px 8px 0 0;
    }
`
const ProjectsLogo = styled.img`
    width: 50px;
    height: 45px;
    margin: 10px;
    @media all and (max-width: 800px) {
        // align-self: center;
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
    const [modalStatus, setModalStatus] = useState({ status: false, type: PAYMENT_CONFIRMATION, data: null, getToken: null })

    Logger(staticContext,'staticContext')

    const [donationData, donationDataLoading, donationDataError, setDonationDataVariables, setDonationData] = useMutationApi(gql(DONATION_MUTATION))
    useEffect(() => {
        if (donationData && donationData.data) {
            Logger(donationData, 'wtf payment')
            let referenceId = lodash.get(donationData, 'data.makeDonation.referenceId')
            let status = lodash.get(donationData, 'data.makeDonation.responseStatus.status') || donationDataError
            if (status === RESPONSE_SUCCESS && referenceId) {
                setModalStatus({ type: PAYMENT_SUCCESS, status: true, data: referenceId })
                showToast('Donation successfull', 'success')
            }
            else {
                showToast('Problem occured while donating', 'error')
            }
        }
    }, [donationData, donationDataError])

    const [projectsData, isGetProjectsLoading, isGetProjectsError, refetchProjectsData] = useQueryApi(gql(GET_PROJECTS), { status: "ACTIVE" })
    useEffect(()=> {
        refetchProjectsData()
    },[])
    
    const projectsArray = lodash.get(projectsData, 'getProjects.projects') || lodash.get(staticContext, 'data.data.getProjects.projects') || []
    
    const [collapseMap, setCollapseMap] = useState({})
    useEffect(()=> {
        let projectsArray = lodash.get(projectsData, 'getProjects.projects') || []
        let map = projectsArray.reduce((map, project) => { 
            map[project.id] = {collapse: true}
            return map
        }, {})
        setCollapseMap(map)
    }, [projectsData])

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
                        </ItemDetail>
                        <CostContainer>
                            <ItemCost>{`Rs. ${cost} per tree`}</ItemCost>
                            <Counter maximumCount={remaining} itemCost={(count, itemChangeCost) => checkoutCostChanger(count, itemChangeCost, item)} cost={cost} />
                        </CostContainer>
                    </ItemContainer>
                    <Collapse isOpened={!(collapseMap[id] && collapseMap[id].collapse)}>
                        <Tabs style={{ textAlign: 'left'}}>
                            <TabList>
                                <Tab>Title 1</Tab>
                                <Tab>Title 2</Tab>
                            </TabList>

                            <TabPanel>
                                <h2>Any content 1</h2>
                            </TabPanel>
                            <TabPanel>
                                <h2>Any content 2</h2>
                            </TabPanel>
                        </Tabs>
                        {/* <ItemContent>
                            <ReactMarkdown source={content} />
                        </ItemContent> */}
                    </Collapse>
                    <Arrow onClick={() => setCollapseMap({ ...collapseMap, [id]: { collapse: !collapseMap[id].collapse } })}>
                        <ArrowSymbol up={collapseMap[id] ? !collapseMap[id].collapse : false} />
                    </Arrow>
                </DonateItem>
            )
        }
        return array
    }
    let donationItems = getDonateItems(projectsArray)

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