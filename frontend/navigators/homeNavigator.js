import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Homepage from "../components/home/Homepage";

export default function LoginNavigator() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Homepage"
        >
            <Stack.Screen name="Home" component={Homepage} />
        </Stack.Navigator>
        </NavigationContainer>
    );
}