import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import UserModel from '../../models/UserModel';

const Button = ({ onPress, title, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: backgroundColor }]}>
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
);

const SignOut = () => {
    const { isLoaded, signOut } = useAuth();
    if (!isLoaded) {
        return null;
    }
    return (
        <Button onPress={signOut} title="登出" backgroundColor="#000" textColor="#fff" />
    );
};

const DeleteAccount = () => {
    const { isLoaded, signOut } = useAuth();
    const { _, isSignedIn, user } = useUser();

    async function deleteAccount() {
        Alert.alert('刪除帳號', '真的要刪除嗎?', [
            {
                text: '取消',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: '確認', onPress: async () => {
                    await UserModel.deleteUser(user.id);
                    signOut();
                }
            }
        ]);

    }
    if (!isLoaded) {
        return null;
    }
    return (
        <Button onPress={deleteAccount} title="刪除帳號" backgroundColor="#FF0000" textColor="#fff" />
    );

}

const UpdateUser = ({ user, navigation }) => {
    async function gotoUpdate() {
        navigation.navigate("UpdateUser", { user: user });
    }
    return (
        <Button onPress={gotoUpdate} title="更新個人資料" backgroundColor="#000" textColor="#fff" />
    );
}

export default function SettingsPage({ route, navigation }) {
    const user = route.params.user;

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <UpdateUser navigation={navigation} user={user} />
                <SignOut />
                <DeleteAccount />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonContainer: {
        width: "80%",
        height: "80%",
        justifyContent: "center",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 50,
        borderRadius: 10,
        margin: 5,
    }
})