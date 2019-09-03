import Header from '../components/Header'
import VolunteerChoices from '../components/volunteerChoices'
import styled from 'styled-components'

const Wrapper = styled.div`
    margin: 30px;
`
function Volunteer() {
    return (
        <>
            <Header />
            <Wrapper>
                <VolunteerChoices />
            </Wrapper>
        </>
    )
}
export default Volunteer