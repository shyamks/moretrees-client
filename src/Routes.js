import MainPage from "./Pages/index";
import NotFound from "./Pages/NotFound";
import { Volunteer } from "./Pages/Volunteer";
import { Donate } from "./Pages/Donate";
import { MyDonations } from "./Pages/MyDonations";
import { loadDataFromServer, getEmailFromToken } from "./helpers";
import { PAGES } from "./constants";
import { MyProfile } from "./Pages/MyProfile";
import { Admin } from "./Pages/Admin";
import { ForgotPassword } from "./Pages/ForgotPassword";
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