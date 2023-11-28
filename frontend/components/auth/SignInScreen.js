import React from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Button } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import SignInWithOAuth from "./SignInWithOAuth";

export default function SignInScreen({ navigation }) {
	const { signIn, setActive, isLoaded } = useSignIn();

	const [emailAddress, setEmailAddress] = React.useState("");
	const [password, setPassword] = React.useState("");

	const onSignInPress = async () => {
		if (!isLoaded) {
			return;
		}

		try {
			const completeSignIn = await signIn.create({
				identifier: emailAddress,
				password,
			});
			// This is an important step,
			// This indicates the user is signed in
			await setActive({ session: completeSignIn.createdSessionId });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<View style={styles.loginContainer}>
			<Text style={styles.title}>
				YourStyle
			</Text>

			<Text style={styles.infoText}>
				Please sign in to continue
			</Text>

			<TextInput
				autoCapitalize="none"
				value={emailAddress}
				placeholder="Email..."
				onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
				style={styles.textInput}
			/>


			<TextInput
				value={password}
				placeholder="Password..."
				secureTextEntry={true}
				onChangeText={(password) => setPassword(password)}
				style={styles.textInput}
			/>

			<TouchableOpacity
				onPress={onSignInPress}
				style={styles.signInButton}
			>
				<Text style={styles.signInText}>Sign in</Text>
			</TouchableOpacity>

			<Text style={styles.infoText}>
				Don't have an account?
			</Text>
			<Button
				title="Sign up with email"
				onPress={() => navigation.navigate("SignUp")}
			/>
			<SignInWithOAuth />
			
		</View>
	);
}

const styles = StyleSheet.create({
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