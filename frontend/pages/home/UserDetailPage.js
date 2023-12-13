import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import PostGrid from "../../components/PostGrid";
import UserModel from "../../models/UserModel";
import UserImage from "../../components/UserImage";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{textAlign: "center"}}>
                    沒有任何貼文
                    </Text>
                </View>
            ) : (
                <ScrollView>
                    <PostGrid posts={posts} navigation={navigation}/>
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
    const user = route.params.user;

    useEffect(() => {
        fetchUser();
    }, [route.params.user]);

    async function fetchUser() {
        const result = await UserModel.getUser(user.id);
        setUser(result);
    }

    async function gotoFollowers() {
        const result = await UserModel.getUserFollowers(user.id);
        console.log(result); 
        navigation.navigate("Follows", { title: "粉絲", data: result, actions: [] });
    }

    async function gotoFollowees() {
        const result = await UserModel.getUserFollowees(user.id);
        console.log(result); 
        navigation.navigate("Follows", { title: "追蹤者", data: result, actions: [] });
    }

    
    return (
        <>
        <View style={styles.container}>
            <TouchableOpacity style={styles.settingBar}>
            </TouchableOpacity>
            <View style={styles.overviews}>
                <>
                
                <UserImage url={user.imageUrl} size={{width: 100, height: 100, borderRadius: 50}} />
                {user.username === null ? (
                    <Text>{user.firstName} {user.lastName}</Text>
                ) : (
                    <Text>{user.username}</Text>
                )}
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity onPress={gotoFollowers}>
                    <Text>粉絲 {_user.follower_count}</Text> 
                    </TouchableOpacity>
                    <Text> | </Text>
                    <TouchableOpacity onPress={gotoFollowees}>
                    <Text>追蹤數 {_user.followee_count}</Text> 
                    </TouchableOpacity>

                </View>
                </>
            </View>
        </View>
        <ContentTab user={user}/>
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
        flex: 1/2,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
});