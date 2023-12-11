import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SignInScreen from "../pages/auth/SignInScreen";
import SignUpScreen from "../pages/auth/SignUpScreen";
import IndexPage from "../pages/eCloset/IndexPage";
import OutfitPage from '../pages/eCloset/OutfitPage';
import ClosetPage from '../pages/eCloset/ClosetPage';
import CalenderPage from '../pages/eCloset/CalenderPage';

export default function LoginNavigator() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
        <Stack.Navigator
            initialRouteName="SignIn"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="eCloset" component={IndexPage} options={{ headerShown: true }}/>
            <Stack.Screen name="Outfit" component={OutfitPage} options={{ headerShown: true }}/>
            <Stack.Screen name="Closet" component={ClosetPage} options={{ headerShown: true }}/>
            <Stack.Screen name="Calender" component={CalenderPage} options={{ headerShown: true }}/>

        </Stack.Navigator>
        </NavigationContainer>
    );
}