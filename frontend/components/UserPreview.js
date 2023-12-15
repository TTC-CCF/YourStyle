import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import UserImage from "./UserImage";

export default function UserPreview({ user, size, follow, navigation }) {
    const imageSize = size.height - 5;
    const _user = useUser();
    const currentUser = _user.user;

    function gotoUserDetailPage() {
        if (user.username)
            navigation.navigate("UserDetail", { user: user, username: user.username });
        else
            navigation.navigate("UserDetail", { user: user, username: user.firstName + " " + user.lastName });
    }

    return (
        <>
            <View style={[styles.container, { width: size.width, height: size.height }]}>
                <View style={[styles.block, { flex: 4 }]}>
                    <TouchableOpacity style={styles.userBlock} onPress={() => gotoUserDetailPage()}>
                        <UserImage url={user.imageUrl} size={{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }} />

                        {user.username === null ? (
                            <Text style={styles.username}>{user.firstName} {user.lastName}</Text>
                        ) : (
                            <Text style={styles.username}>{user.username}</Text>
                        )}
                    </TouchableOpacity>
                </View>
                {follow && currentUser.id !== user.id && (
                    <View style={[styles.block, { flex: 1 }]}>
                        <TouchableOpacity style={styles.followButton}>
                            <Text>追蹤</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    block: {
        alignItems: "flex-start",
        justifyContent: "center",
    },
    userBlock: {
        flexDirection: "row",
        alignItems: "center",
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
    },
    followButton: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: 50,
    }
});