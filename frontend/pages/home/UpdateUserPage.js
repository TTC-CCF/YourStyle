import { View, Text, StyleSheet, TextInput, TouchableOpacity, Touchable } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import UserImage from '../../components/UserImage';

const InputComponent = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
    return (
        <View style={styles.block}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.block, { flexDirection: "row" }]}>
                <TextInput
                    style={styles.textInput}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry}
                />
            </View>

        </View>
    );
}

export default function UpdateUserPage({ route, navigation }) {
    const user = route.params.user;
    console.log(user)

    return (
        <View style={styles.container}>
            <View style={[styles.block, { width: "80%", height: "80%" }]}>
                <View style={[styles.block, {flex: 2, width: "60%"}]}>
                    <TouchableOpacity>
                        <UserImage url={user.imageUrl} size={{width: 100, height: 100, borderRadius: 50}}></UserImage>
                    </TouchableOpacity>
                </View>
                <View style={[styles.block, { flex: 1, width: "80%" }]}>
                    <InputComponent
                        label="修改用戶名稱"
                        placeholder={user.username ? user.username : `${user.firstName} ${user.lastName}`}
                    />
                </View>
                <View style={[styles.block, { flex: 1, width: "80%" }]}>
                    <InputComponent
                        label="修改Email"
                        placeholder={user.emailAddresses[0].emailAddress}
                    />
                </View>

                <View style={[styles.block, { flex: 1, width: "80%" }]}>
                    <InputComponent label="修改身高" />
                </View>
                <View style={{ flex: 1 }}></View>
                <View style={[styles.block, { flex: 1, width: "70%" }]}>
                    <TouchableOpacity style={[styles.button, { flex: 1 / 2, width: "80%" }]}>
                        <Text style={styles.label}>更改密碼</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.block, { flex: 1, width: "70%" }]}>
                    <TouchableOpacity style={[styles.button, { flex: 1 / 2, width: "80%" }]}>
                        <Text style={styles.label}>修改</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    block: {
        alignItems: "center",
        justifyContent: "center",
    },
    textInput: {
        height: 40,
        width: "80%",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
    },
    label: {
        fontSize: 20,
        fontWeight: "bold",
    },
    button: {
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        height: 40,
    }
})