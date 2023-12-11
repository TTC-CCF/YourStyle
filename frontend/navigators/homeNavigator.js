import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import FooterNavigator from './footerNavigator';
import PostDetailPage from '../pages/home/PostDetailPage';
import FollowsPage from "../pages/home/FollowsPage";
import SettingsPage from "../pages/home/SettingsPage";
import OutfitPage from '../pages/eCloset/OutfitPage';
import ClosetPage from '../pages/eCloset/ClosetPage';
import CalenderPage from '../pages/eCloset/CalenderPage';

export default function HomeNavigator() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }}
            id='homeNavigator'
        >
            <Stack.Screen name="Footer" component={FooterNavigator} />
            <Stack.Screen 
            name="PostDetail" 
            component={PostDetailPage} 
            options={({ route }) => ({
                headerShown: true, 
                headerTitle: route.params.post.title
            })} />
            <Stack.Screen 
            name="Follows" 
            component={FollowsPage} 
            options={({ route }) => ({
                headerShown: true, 
                headerTitle: route.params.title
            })} />
            <Stack.Screen name="Settings" component={SettingsPage} options={{ headerShown: true }}/>
            <Stack.Screen name="Outfit" component={OutfitPage} options={{ headerShown: true }}/>
            <Stack.Screen name="Closet" component={ClosetPage} options={{ headerShown: true }}/>
            <Stack.Screen name="Calender" component={CalenderPage} options={{ headerShown: true }}/>

        </Stack.Navigator>
        
        </NavigationContainer>
    );
}