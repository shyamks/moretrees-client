import Header from '../components/Header'
import VolunteerChoices from '../components/volunteerChoices'
import styled from 'styled-components'
import Footer from '../components/Footer';

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