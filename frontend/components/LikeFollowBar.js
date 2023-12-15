import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import PostModel from "../models/PostModel";
import { useState } from "react";

export default function LikeFollowBar({ size, post, userId }) {
    const [liked, setLiked] = useState(post.likepost.find((item) => item.user_id === userId) ? true : false);

    async function handleLike() {
        await PostModel.likePost(post.id, userId);
        setLiked(true);
    }

    async function handleUnlike() {
        await PostModel.unlikePost(post.id, userId);
        setLiked(false);
    }

    return (
        <View style={[styles.container, size]}>
            {liked ? (
                <TouchableOpacity onPress={handleUnlike}>
                    <MaterialCommunityIcons name="thumb-up" size={24} color="black" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={handleLike}>
                    <MaterialCommunityIcons name="thumb-up-outline" size={24} color="black" />
                </TouchableOpacity>
            )}

            <TouchableOpacity>
                <Feather name="archive" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});