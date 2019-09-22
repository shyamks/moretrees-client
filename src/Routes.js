import MainPage from "./Pages/index";
import Volunteer from "./Pages/volunteer";
import Donate from "./Pages/donate";
import MyDonations from "./Pages/myDonations";
// import Country from "./Pages/myDonations";
import NotFound from "./Pages/NotFound";
import { loadDataFromServer } from "./helpers";

const Routes = [
    {
        path: '/',
        name: 'mainPage',
        exact: true,
        component: MainPage
    },
    {
        path: '/donate',
        name: 'donatePage',
        exact: true,
        component: Donate,
        loadData: () => loadDataFromServer('donate')
    },
    {
        path: '/volunteer',
        name: 'volunteerPage',
        exact: true,
        component: Volunteer,
        loadData: () => loadDataFromServer('donate')
    },
    {
        path: '/myDonations',
        name: 'myDonationsPage',
        exact: true,
        component: MyDonations,
        loadData: () => loadDataFromServer('donate')
    },
    {
        component: NotFound,
        name: 'notFoundPage',
    }
]

export default Routes