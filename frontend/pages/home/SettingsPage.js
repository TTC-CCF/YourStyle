import { View, Button, Text, StyleSheet } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';


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

const DeleteAccount = () => {
    const { isLoaded, signOut } = useAuth();
    const { _, isSignedIn, user } = useUser();

    async function deleteAccount() {
        // const token = await getToken();
        await UserModel.deleteUser(user.id);
        signOut();
    }
    if (!isLoaded) {
        return null;
    }
    return (
        <View>
            <Button
                title="Delete Account"
                onPress={() => {
                    deleteAccount();
                }}
            />
        </View>
    );

}

export default function SettingsPage() {
    return (
        <View style={styles.container}>
            <Text>Settings Page</Text>
            <SignOut />
            <DeleteAccount />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})