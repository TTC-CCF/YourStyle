import { Text, View, StyleSheet, Button } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import PostModel from "../../models/PostModel";
import CarouselComponent from "../../components/CarouselComponent";
import { useEffect, useState } from "react";

const SignOut = () => {
    const { isLoaded, signOut } = useAuth();
    if (!isLoaded) {
        return null;
    }
    return (
        <View>
            <Button
                title="Sign Out"
                onPress={() => {
                    signOut();
                }}
            />
        </View>
    );
};

export default function Homepage({ navigation }) {
    const { isLoaded, isSignedIn, user } = useUser();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchRecommendation();
    }, []);
    async function fetchRecommendation() {
        const post = await PostModel.getRecommendation(user.id);
        // console.log(post.data);
        setPosts(post.data);
    }

    return (
        <View style={styles.container}>
            {posts.length === 0 ? (
                <Text>Loading...</Text>
            ) : (
                <CarouselComponent title={'你可能喜歡'} blocks={posts} navigation={navigation}/>
            )}
            <SignOut />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
});