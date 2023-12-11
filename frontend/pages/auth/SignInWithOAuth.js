import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/warmUpBrowser";
import UserModel from "../../models/UserModel";

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
                    signUp.createdUserId
                );
            }
            
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    }, []);

    return (
        <>
            <TouchableOpacity 
                style={styles.container} 
                onPress={onPress}
            >
                <Image
                    source={require('../../assets/google-logo.png')}
                    fadeDuration={0}
                    style={{ width: 50, height: 50 }}
                />
                <Text style={styles.signInText}>Sign in with Google</Text>
            </TouchableOpacity>
                
        </>
       
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", 
        alignItems: "center",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    signInText: {
        fontSize: 20,
        padding: 10,
    }

});

export default SignInWithOAuth;