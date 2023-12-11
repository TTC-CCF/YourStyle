import { Text, View, StyleSheet, Button, ScrollView, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather } from '@expo/vector-icons';
import UserModel from "../../models/UserModel";
import UserImage from "../../components/UserImage";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PostGrid from "../../components/PostGrid";
import { useEffect, useState } from "react";


function Archieve() {
    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text>Archieve</Text>
        </View>
    );
 
}

function UserPosts({ navigation }) {
    const { isLoaded, isSignedIn, user } = useUser();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (isLoaded) fetchPosts(user.id);
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
                    You don't have any post now{'\n'}
                    go to New tab to create your own post
                    </Text>
                </View>
            ) : (
                <ScrollView>
                    {!posts || posts.length === 0 ? (
                        <View style={{alignItems: "center", justifyContent: "center"}}>
                            <Text style={{textAlign: "center"}}>
                            You don't have any post now{'\n'}
                            go to New tab to create your own post
                            </Text>
                        </View>
                    ) : (
                        <PostGrid posts={posts} navigation={navigation}/>
                    )}
                </ScrollView>
            )}
        </>
        
    );

}

function ContentTab() {
    const Tab = createMaterialTopTabNavigator(); 

    return (
        <Tab.Navigator>
            <Tab.Screen name="貼文" component={UserPosts} />
            <Tab.Screen name="收藏" component={Archieve} />
        </Tab.Navigator>

    );
}



export default function ProfilePage({ navigation }) {
    const { isLoaded, isSignedIn, user } = useUser();
    const [_user, setUser] = useState({});

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        const result = await UserModel.getUser(user.id);
        setUser(result);
    }

    async function gotoFollowers() {
        const result = await UserModel.getUserFollowers(user.id);
        console.log(result); 
        navigation.navigate("Follows", { title: "追蹤者", data: result, actions: ["取消追蹤"] });
    }

    async function gotoFollowees() {
        const result = await UserModel.getUserFollowees(user.id);
        console.log(result); 
        navigation.navigate("Follows", { title: "粉絲", data: result, actions: ["移除粉絲"] });
    }

    function gotoSettings() {
        navigation.navigate("Settings");
    }

    return (
        <>
        <View style={styles.container}>
            <TouchableOpacity style={styles.settingBar} onPress={gotoSettings}>
                <Feather name="settings" style={styles.setting} size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.overviews}>
                {isLoaded && isSignedIn && (
                    <>
                    
                    <UserImage url={user.imageUrl} size={{width: 100, height: 100, borderRadius: 50}} />
                    {user.username === null ? (
                        <Text>{user.firstName} {user.lastName}</Text>
                    ) : (
                        <Text>{user.username}</Text>
                    )}
                    <View style={{flexDirection: "row"}}>
                        <TouchableOpacity onPress={gotoFollowers}>
                        <Text>追蹤數 {_user.follower_count}</Text> 
                        </TouchableOpacity>
                        <Text> | </Text>
                        <TouchableOpacity onPress={gotoFollowees}>
                        <Text>粉絲數 {_user.followee_count}</Text> 
                        </TouchableOpacity>

                    </View>
                    </>
                )}
            </View>
        </View>
        <ContentTab />
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