import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import UserModel from "../../models/UserModel";
import SignInWithOAuth from "./SignInWithOAuth";

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [username, setUserName] = React.useState("");
    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [pendingVerification, setPendingVerification] = React.useState(false);
    const [code, setCode] = React.useState("");
    const [error, setError] = React.useState("");

    // start the sign up process.
    const onSignUpPress = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const res = await signUp.create({
                username,
                emailAddress,
                password,
            });

            console.log(JSON.stringify(res, null, 2));
            
            // send the email.
            // await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            // change the UI to our pending section.
            // setPendingVerification(true);

            await UserModel.createUser(res.createdUserId);

            await setActive({ session: res.createdSessionId });
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors[0].longMessage);
        }
    };

    // This verifies the user using email code that is delivered.
    const onPressVerify = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });
            console.log(JSON.stringify(completeSignUp, null, 2));

            await UserModel.createUser(completeSignUp.createdUserId);

            await setActive({ session: completeSignUp.createdSessionId });
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors[0].longMessage);
        }
    };

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.title}>
                YourStyle
            </Text>
            {error === "" && <Text style={styles.infoText}>Sign up account</Text>}
            {error !== "" && <Text style={styles.errText}>{error}</Text>}
            {!pendingVerification && (
                <>
                    <TextInput
                        autoCapitalize="none"
                        value={username}
                        placeholder="User Name..."
                        onChangeText={(username) => setUserName(username)}
                        style={styles.textInput}
                    />
                    
                    <TextInput
                        autoCapitalize="none"
                        value={emailAddress}
                        placeholder="Email..."
                        onChangeText={(email) => setEmailAddress(email)}
                        style={styles.textInput}
                    />

                    <TextInput
                        value={password}
                        placeholder="Password..."
                        placeholderTextColor="#000"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                        style={styles.textInput}
                    />


                    <TouchableOpacity
                        onPress={onSignUpPress}
                        style={styles.signInButton}
                    >
                        <Text style={styles.signInText}>Sign up</Text>
                    </TouchableOpacity>

                    <SignInWithOAuth />
                </>
            )}
            {pendingVerification && (
                <>
                    <TextInput
                        value={code}
                        placeholder="Code..."
                        onChangeText={(code) => setCode(code)}
                        style={styles.textInput}
                    />
                    <TouchableOpacity 
                        onPress={onPressVerify}
                        style={styles.signInButton}
                    >
                        <Text style={styles.signInText}>Verify Email</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
    
}

const styles = StyleSheet.create({
    errText: {
        color: "#f00",
        textAlign: "center",
        fontSize: 16,
    },
    title: {
        color: "#000",
        textAlign: "center",
        fontSize: 60,
        fontWeight: "bold",
        marginBottom: 100,
    },
    loginContainer: {
        width: "100%",
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        width: "80%",
        borderColor: "#000",
        borderWidth: 3,
        borderRadius: 5,
        padding: 10,
        margin: 10,
    },
    signInButton: {
        backgroundColor: "#000",
        padding: 10,
        margin: 10,
        width: "80%",
        borderRadius: 5,
    },
    signInText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 20,
    },
    infoText: {
        color: "#000",
        textAlign: "center",
        fontSize: 20,
    }
});