import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from "@react-navigation/native";
import Homepage from "../components/home/Homepage";
import Feeds from '../components/home/Feeds';
import Post from '../components/home/Post';

export default function LoginNavigator() {
    const Tab = createBottomTabNavigator();
    return (
        <NavigationContainer>
        <Tab.Navigator
            initialRouteName="Homepage"
        >
            <Tab.Screen name="Home" component={Homepage} />
            <Tab.Screen name="Feeds" component={Feeds} />
            <Tab.Screen name="New" component={Post} />
        </Tab.Navigator>
        </NavigationContainer>
    );
}