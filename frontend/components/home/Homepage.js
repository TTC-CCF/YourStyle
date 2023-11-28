import { Text, View, StyleSheet, Button } from "react-native";
import { useAuth } from "@clerk/clerk-react";

const SignOut = () => {
    const { isLoaded, signOut } = useAuth();
    if (!isLoaded) {
        return null;
    }
    return (
        <View>
            <Button
                title="Sign Out"
                onPress={() => {
                    signOut();
                }}
            />
        </View>
    );
};

export default function Homepage() {
    return (
        <View style={styles.container}>
            <Text>
                Hello World!
            </Text>
            <SignOut />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
});