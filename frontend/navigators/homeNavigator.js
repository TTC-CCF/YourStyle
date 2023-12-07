import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import FooterNavigator from './footerNavigator';
import PostDetailPage from '../pages/home/PostDetailPage';

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
            })}>
            </Stack.Screen>
        </Stack.Navigator>
        
        </NavigationContainer>
    );
}