import Header from '../components/Header'
import VolunteerChoices from '../components/volunteerChoices'

import { ApolloProvider } from '@apollo/react-hooks';

function Volunteer() {
    return (
        <div>
            <Header />
            <VolunteerChoices />
        </div>
    )
}
export default Volunteer