import DonateItems from '../components/donateItems'
import Header from '../components/Header'

import { ApolloProvider } from '@apollo/react-hooks';

function Donate() {
    return (
        <div>
            <Header />
            <DonateItems />
        </div>
    )
}

export default Donate