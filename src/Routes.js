import MainPage from "./Pages/index";
import Volunteer from "./Pages/volunteer";
import Donate from "./Pages/donate";
import MyDonations from "./Pages/myDonations";
// import Country from "./Pages/myDonations";
import NotFound from "./Pages/NotFound";
import { loadDataFromServer, getEmailFromToken } from "./helpers";
import { PAGES } from "./constants";
import MyProfile from "./Pages/myProfile";
import Admin from "./Pages/admin";
import { ForgotPassword } from "./Pages/forgotPassword";
import { Reset } from "./Pages/Reset";

const Routes = [
    {
        path: PAGES.INDEX,
        name: 'mainPage',
        exact: true,
        component: MainPage
    },
    {
        path: PAGES.DONATE,
        name: 'donatePage',
        exact: true,
        component: Donate,
        loadData: (endpoint) => loadDataFromServer('donate', endpoint)
    },
    {
        path: PAGES.VOLUNTEER,
        name: 'volunteerPage',
        exact: true,
        component: Volunteer,
        loadData: (endpoint) => loadDataFromServer('volunteer', endpoint)
    },
    {
        path: PAGES.MY_DONATIONS,
        name: 'myDonationsPage',
        exact: true,
        component: MyDonations,
        loadData: (endpoint) => loadDataFromServer('myDonations', endpoint)
    },
    {
        path: PAGES.PROFILE,
        name: 'myProfile',
        exact: true,
        component: MyProfile,
        loadData: (endpoint) => loadDataFromServer('myProfile', endpoint)
    },
    {
        path: PAGES.ADMIN,
        name: 'admin',
        exact: true,
        component: Admin,
        loadData: (endpoint) => loadDataFromServer('admin', endpoint)
    },
    {
        path: PAGES.FORGOT_PASSWORD,
        name: 'forgotPassword',
        exact: true,
        component: ForgotPassword,
        loadData: (endpoint) => loadDataFromServer('forgotPassword', endpoint)
    },
    {
        path: PAGES.RESET,
        name: 'reset',
        component: Reset,
        confirmToken: (endpoint, token) => getEmailFromToken(endpoint, token)
    },
    {
        component: NotFound,
        name: 'notFoundPage',
    }
]

export default Routes