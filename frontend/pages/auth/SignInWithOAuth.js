import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text } from "react-native";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/warmUpBrowser";
import UserModel from "../../models/UserModel";
import Icon from 'react-native-vector-icons/FontAwesome';

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    useWarmUpBrowser();

    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

    const onPress = React.useCallback(async () => {
        try {
            const { createdSessionId, signIn, signUp, setActive } =
                await startOAuthFlow();

            if (createdSessionId) {
                setActive({ session: createdSessionId });
            } else {
                // Use signIn or signUp for next steps such as MFA
            }

            if (signUp && signUp.createdUserId) {
                await UserModel.createUser(
                    `${signUp.firstName} ${signUp.lastName}`,
                    signUp.emailAddress,
                    signUp.createdUserId
                );
            }
            
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    }, []);

    return (
        <>
            <Icon
                name="google"
                size={30}
                onPress={onPress}
            />
        </>
       
    );
}
export default SignInWithOAuth;