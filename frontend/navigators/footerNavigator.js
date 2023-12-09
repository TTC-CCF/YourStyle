import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homepage from "../pages/home/Homepage";
import FeedsPage from '../pages/home/FeedsPage';
import NewPostPage from '../pages/home/NewPostPage';
import ClosetPage from '../pages/home/ClosetPage';

export default function FooterNavigator() {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            initialRouteName="Homepage"
            id="footerNavigator"
        >
            <Tab.Screen name="Home" component={Homepage} />
            <Tab.Screen name="Feeds" component={FeedsPage} />
            <Tab.Screen name="New" component={NewPostPage} />
            <Tab.Screen name="Closet" component={ClosetPage} />
        </Tab.Navigator>
    );
}