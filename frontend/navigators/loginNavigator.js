import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SignInScreen from "../components/auth/SignInScreen";
import SignUpScreen from "../components/auth/SignUpScreen";

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
        </Stack.Navigator>
        </NavigationContainer>
    );
}