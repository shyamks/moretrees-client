import styled from 'styled-components'
import EmailIcon from './svg-icons/email-icon';

const Wrapper = styled.footer`
    width: 100%;
    height: auto;
    margin-top: 20px;
    background-color: #454f48;
    display: flex;
    flex-direction: horizontal;
    justify-content: space-between;
`

const Mission = styled.div`
    width: 210px;
    height: auto;
    margin: 50px 20px 20px 50px;
    padding-bottom: 40px;

    // background-color: grey;
`

const MissionHeading = styled.div`
    margin: 2px 2px 0 2px;
    text-align: center;
    font-size: 26px;
`

const MissionContent = styled.div`
    margin: 2px 2px 0 2px;
    text-align: center;
    justify-content: center;
    font-size: 14px;
`

const ContactUs = styled.div`
    width: auto;
    height: auto;
    margin: 50px 50px 20px 20px;
    // background-color: grey;
`

const ContactDetail = styled.div`
    margin: 10px;
    display: flex;
    flex: horizontal;
`
const IconContainer = styled.div`
    margin-right: 5px;
`
const Detail = styled.div`
    line-height: 24px;

`
function Footer({footerFixed}) {

    let footerPosition = footerFixed || 'relative'
    return (
        <Wrapper style={{position: footerPosition}}>
            <Mission>
                <MissionHeading> Our Mission </MissionHeading>
                <MissionContent> So seed seed green that winged cattle in. Gathering thing made fly you're no divided deep moved us lan Gathering thing us land years living. So seed seed green that winged cattle in. Gathering thing made fly you're no divided deep moved</MissionContent>
            </Mission>
            <ContactUs>
                <MissionHeading>Contact Us</MissionHeading>
                <MissionContent>
                    <ContactDetail>
                        <IconContainer>
                            <EmailIcon/>
                        </IconContainer>
                        <Detail>shyam.kodmad@gmail.com</Detail>
                    </ContactDetail>
                </MissionContent>
            </ContactUs>
        </Wrapper>
    )
}

export default Footer