import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import PostGrid from "../../components/PostGrid";
import UserModel from "../../models/UserModel";
import UserImage from "../../components/UserImage";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useUser } from "@clerk/clerk-expo";

function UserPosts({ route, navigation }) {
    const [posts, setPosts] = useState([]);
    const user = route.params.user;

    useEffect(() => {
        fetchPosts(user.id);
    }, []);

    async function fetchPosts(userId) {
        const post = await UserModel.getUserPosts(userId);
        setPosts(post);
    }

    return (
        <>
            {!posts || posts.length === 0 ? (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ textAlign: "center" }}>
                        沒有任何貼文
                    </Text>
                </View>
            ) : (
                <ScrollView>
                    <PostGrid posts={posts} navigation={navigation} />
                </ScrollView>
            )}
        </>

    );

}

function ContentTab({ user }) {
    const Tab = createMaterialTopTabNavigator();

    return (
        <Tab.Navigator>
            <Tab.Screen name="貼文" component={UserPosts} initialParams={{ user }} />
        </Tab.Navigator>
    );
}



export default function UserDetailPage({ route, navigation }) {
    const [_user, setUser] = useState({});
    const [isFollow, setIsFollow] = useState(false);
    const __user = useUser();
    const currentUser = __user.user;
    const user = route.params.user;
    

    useEffect(() => {
        fetchData();
    }, [route.params.user]);

    async function fetchData() {
        const result = await UserModel.getUser(user.id);
        setUser(result);

        const currentUserFollowees = await UserModel.getUserFollowees(currentUser.id);
        if (currentUserFollowees.find((item) => item.id === user.id)) {
            setIsFollow(true);
        }
        
    }

    async function gotoFollowers() {
        const result = await UserModel.getUserFollowers(user.id);
        console.log(result);
        navigation.navigate("Follows", { title: "粉絲", data: result, action: null });
    }

    async function gotoFollowees() {
        const result = await UserModel.getUserFollowees(user.id);
        console.log(result);
        navigation.navigate("Follows", { title: "追蹤者", data: result, action: null });
    }

    async function followUser() {
        const result = await UserModel.followUser(currentUser.id, user.id);
        setIsFollow(true);
        await fetchData();
    }

    async function unfollowUser() {
        const result = await UserModel.unfollowUser(currentUser.id, user.id);
        setIsFollow(false);
        await fetchData();
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity style={styles.settingBar}>
                </TouchableOpacity>
                <View style={styles.overviews}>
                    <>

                        <UserImage url={user.imageUrl} size={{ width: 100, height: 100, borderRadius: 50 }} />
                        {user.username === null ? (
                            <Text>{user.firstName} {user.lastName}</Text>
                        ) : (
                            <Text>{user.username}</Text>
                        )}
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={gotoFollowers}>
                                <Text>粉絲 {_user.follower_count}</Text>
                            </TouchableOpacity>
                            <Text> | </Text>
                            <TouchableOpacity onPress={gotoFollowees}>
                                <Text>追蹤數 {_user.followee_count}</Text>
                            </TouchableOpacity>

                        </View>
                        
                        <View style={{ margin: 10 }}>
                        {isFollow ? (
                            <TouchableOpacity style={styles.followButton} onPress={unfollowUser}>
                                <Text style={{ padding: 5 }}>取消追蹤</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.followButton} onPress={followUser}>
                                <Text style={{ padding: 5 }}>追蹤</Text>
                            </TouchableOpacity>
                        )}
                        </View>

                    </>
                </View>
            </View>
            <ContentTab user={user} />
        </>

    )
};

const styles = StyleSheet.create({
    settingBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
    },
    setting: {
        margin: 10,

    },
    overviews: {
        flex: 3,
        alignItems: "center",
    },
    contents: {
        flex: 5,
        alignItems: "center",
    },
    container: {
        flex: 1 / 2,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
    followButton: {
        borderWidth: 1,
        borderColor: "#eee",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        height: 30,
    }
});