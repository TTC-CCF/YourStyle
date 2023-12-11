import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import PostModel from "../../models/PostModel";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import UserPreview from "../../components/UserPreview";

export default function PostDetailComponent({route, navigation}) {
    const { getToken } = useAuth();
    const {isLoaded, isSignedIn, user} = useUser();
    const post = route.params.post;

    async function handleDelete() {
        const token = await getToken();
        await PostModel.deletePost(post.id, token);
        navigation.getParent("homeNavigator").navigate("Feeds", {update: true});
    }

    return ( 
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.contentContainer}
            >
                <UserPreview user={post.user} size={{width: Dimensions.get("window").width}} navigation={navigation} />
                <Image source={{uri: post.image_url}} style={{width: Dimensions.get("window").width, height: 520}} />
                <Text style={styles.description}>{post.description}</Text>
                {user.id === post.user_id && (
                    <TouchableOpacity
                        onPress={() => { handleDelete() }}
                    >
                        <Text style={styles.description}>Delete Post</Text>
                    </TouchableOpacity>
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
    },
});