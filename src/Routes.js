import MainPage from "./Pages/index";
import Volunteer from "./Pages/volunteer";
import Donate from "./Pages/donate";
import MyDonations from "./Pages/myDonations";
// import Country from "./Pages/myDonations";
import NotFound from "./Pages/NotFound";
import { loadDataFromServer } from "./helpers";
import { PAGES } from "./constants";
import MyProfile from "./Pages/myProfile";
import Admin from "./Pages/admin";

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
        loadData: () => loadDataFromServer('donate')
    },
    {
        path: PAGES.VOLUNTEER,
        name: 'volunteerPage',
        exact: true,
        component: Volunteer,
        loadData: () => loadDataFromServer('volunteer')
    },
    {
        path: PAGES.MY_DONATIONS,
        name: 'myDonationsPage',
        exact: true,
        component: MyDonations,
        loadData: () => loadDataFromServer('myDonations')
    },
    {
        path: PAGES.PROFILE,
        name: 'myProfile',
        exact: true,
        component: MyProfile,
        loadData: () => loadDataFromServer('myProfile')
    },
    {
        path: PAGES.ADMIN,
        name: 'admin',
        exact: true,
        component: Admin,
        loadData: () => loadDataFromServer('admin')
    },
    {
        component: NotFound,
        name: 'notFoundPage',
    }
]

export default Routes