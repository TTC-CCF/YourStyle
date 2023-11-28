import React from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button } from 'react-native';
import { ClerkProvider, SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from "expo-secure-store";
import LoginNavigator from "./navigators/loginNavigator";
import HomeNavigator from "./navigators/homeNavigator";

const tokenCache = {
    async getToken(key) {
        try {
            return SecureStore.getItemAsync(key);
        } catch (err) {
            return null;
        }
    },
    async saveToken(key, value) {
        try {
            return SecureStore.setItemAsync(key, value);
        } catch (err) {
            return;
        }
    },
};



export default function App() {
    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <SignedIn>
                <HomeNavigator />
            </SignedIn>
            <SignedOut>
                <LoginNavigator />
            </SignedOut>
        </ClerkProvider>

    );
}