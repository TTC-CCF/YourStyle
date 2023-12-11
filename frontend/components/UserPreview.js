import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import UserImage from "./UserImage";

export default function UserPreview({ user, size, navigation }) {
    const { isLoaded, isSignedIn } = useUser();
    const userInfo = user;

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("UserDetail", { user: userInfo });
            }}
        >
            <View style={[styles.container, {width: size.width, height: size.height}]}>
                
                <UserImage url={userInfo.imageUrl} size={{width: 30, height: 30, borderRadius: 15}} />

                {userInfo.username === null ? (
                    <Text style={styles.username}>{userInfo.firstName} {userInfo.lastName}</Text>
                ) : (
                    <Text style={styles.username}>{userInfo.username}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    username: {
        padding: 5,
        fontSize: 16,
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#eee",
        marginLeft: 10,
    }
});