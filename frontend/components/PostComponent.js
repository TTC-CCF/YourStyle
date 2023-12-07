import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import PostModel from "../models/PostModel";
import { useUser } from "@clerk/clerk-expo";

export default function PostComponent({post, navigation, size}) {
    const {isLoaded, isSignedIn, user} = useUser();

    async function handleTouch() {
        await PostModel.clickPost(post.id, user.id);
        navigation.navigate("PostDetail", { post });
    }

    return (
        <TouchableOpacity
            onPress={handleTouch}
        >   
            <View
                style={styles.container}
            >
                <Image source={{uri: post.image_url}} style={{width: size.width, height: size.height}} />
                
            </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        padding: 1
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