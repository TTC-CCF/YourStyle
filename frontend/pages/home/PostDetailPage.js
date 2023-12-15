import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import PostModel from "../../models/PostModel";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import UserPreview from "../../components/UserPreview";
import LikeFollowBar from "../../components/LikeFollowBar";

const Content = ({ post, user }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: post.image_url }} style={{ width: Dimensions.get("window").width, height: 520 }} />
            <LikeFollowBar size={{ width: Dimensions.get("window").width, height: 50 }} post={post} userId={user.id} />
        </View>
    );
}

const Detail = ({ post }) => {
    return (
        <View style={[styles.container, { width: "100%", backgroundColor: "#efefef" }]}>
            <Text style={[styles.title, { flex: 1, margin: 10 }]}>Descriptions</Text>

            <Text style={[styles.description, { flex: 1 }]}>{post.description}</Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
                {post.tag.map((tag, index) => (
                    <Text key={index} style={[styles.description]}>#{tag.name}</Text>
                ))}
            </View>
            <View style={{ height: 200 }}></View>
        </View>
    )
}


export default function PostDetailComponent({ route, navigation }) {
    const { getToken } = useAuth();
    const { user } = useUser();
    const post = route.params.post;

    async function handleDelete() {
        const token = await getToken();
        await PostModel.deletePost(post.id, token);
        navigation.getParent("homeNavigator").navigate("Feeds", { update: true });
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
            >
                <UserPreview user={post.user} follow={true} size={{ width: Dimensions.get("window").width, height: 50 }} navigation={navigation} />
                <Content post={post} user={user} />
                <Detail post={post} />
                {user.id === post.user_id && (
                    <>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#f31" }]} onPress={handleDelete}>
                            <Text style={styles.description}>Delete Post</Text>
                        </TouchableOpacity>
                        <View style={{ height: 50 }}></View>
                    </>


                )}
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    description: {
        fontSize: 16,
        padding: 10,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        height: 50,
        borderRadius: 10,
        margin: 5,
    }
});