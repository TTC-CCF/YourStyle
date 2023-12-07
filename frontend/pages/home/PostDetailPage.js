import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import PostModel from "../../models/PostModel";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";

export default function PostDetailComponent({route, navigation}) {
    const { getToken } = useAuth();
    const {isLoaded, isSignedIn, user} = useUser();
    const [post, setPost] = useState({});

    useEffect(() => {
        setPost(route.params.post);
        console.log(post)
    }, []);

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
                <Image source={{uri: post.image_url}} style={{width: 300, height: 450}} />
                <Text style={styles.title}>{post.title}</Text>
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
        marginTop: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    description: {
        fontSize: 16,
    },
});