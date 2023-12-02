import { Text, View, StyleSheet, Button, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import PostModel from "../../models/PostModel";

export default function Feeds() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const post = await PostModel.listPosts();
            console.log(post);
            setPosts(post);
        }
        fetchData();

        
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView centerContent="true" contentContainerStyle={styles.contentContainer}>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <View key={post.id}>
                        <Text style={styles.title}>Title: {post.title}</Text>
                        <Text style={styles.description}>Description: {post.description}</Text>
                        <Image source={{uri: post.image_url}} style={{width: 200, height: 200}} />
                    </View>
                ))
            ) : (
                <>
                <Text>Loading...</Text>
                </>
            )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
    contentContainer: {
        backgroundColor: "#fff",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },

});
