import { Text, View, StyleSheet, Button, Dimensions } from "react-native";
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
    const [users, setUsers] = useState([]);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        fetchRecommendation();
        fetchTopUsers();
    }, []);

    function gotoUserDetail(_user) {
        let navigateTo = "UserDetail";
        if (user.id === _user.id) navigateTo = "Profile";

        if (_user.username)
            navigation.navigate(navigateTo, { user: _user, username: _user.username });
        else
            navigation.navigate(navigateTo, { user: _user, username: _user.firstName + " " + _user.lastName });
    }

    function onPageLayout(event) {
        const { width, height } = event.nativeEvent.layout;
        setHeight(height);
        setWidth(width);
    }

    async function fetchRecommendation() {
        const post = await PostModel.getRecommendation(user.id);
        setPosts(post.data);
    }

    async function fetchTopUsers() {
        const user = await PostModel.getTopUsers();
        setUsers(user.data);
    }
 
    return (
        <View style={styles.container} onLayout={onPageLayout}>
            
            {posts.length === 0 ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <CarouselComponent 
                        title={'猜你喜歡'}
                        size={{width: width, height: height * 0.50}}
                        type={"post"} 
                        blocks={posts} 
                        navigation={navigation}
                    />
                    <CarouselComponent
                        title={'時尚博主'}
                        size={{width: width, height: height * 0.3}}
                        type={"topUsers"}
                        blocks={users}
                        onPress={gotoUserDetail}
                        navigation={navigation}
                    />
                </>
                
            )}
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