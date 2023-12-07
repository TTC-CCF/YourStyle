import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SignInScreen from "../pages/auth/SignInScreen";
import SignUpScreen from "../pages/auth/SignUpScreen";
import ClosetPage from "../pages/home/ClosetPage";

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
            <Stack.Screen name="Closet" component={ClosetPage} />
        </Stack.Navigator>
        </NavigationContainer>
    );
}