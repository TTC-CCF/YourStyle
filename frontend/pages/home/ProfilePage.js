import { Text, View, StyleSheet, Button, ScrollView } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather } from '@expo/vector-icons';
import UserModel from "../../models/UserModel";
import UserImage from "../../components/UserImage";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PostGrid from "../../components/PostGrid";
import { useEffect, useState } from "react";


function Settings() {
    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <SignOut />
            <DeleteAccount />
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
            <Tab.Screen name="Posts" component={UserPosts} />
            <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>

    );
}

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

const DeleteAccount = () => {
    const { isLoaded, signOut } = useAuth();
    const { _, isSignedIn, user } = useUser();

    async function deleteAccount() {
        // const token = await getToken();
        await UserModel.deleteUser(user.id);
        signOut();
    }
    if (!isLoaded) {
        return null;
    }
    return (
        <View>
            <Button
                title="Delete Account"
                onPress={() => {
                    deleteAccount();
                }}
            />
        </View>
    );

}

export default function ProfilePage({ navigation }) {
    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <>
        <View style={styles.container}>
            <View style={styles.settingBar}>
                <Feather name="settings" size={24} color="black" />
                <Feather name="settings" size={24} color="black" />
                <Feather name="settings" size={24} color="black" />
            </View>
            <View style={styles.overviews}>
                {isLoaded && isSignedIn && (
                    <>
                    {user.username === null ? (
                        <Text>Welcome {user.firstName} {user.lastName}</Text>
                    ) : (
                        <Text>Welcome {user.username}</Text>
                    )}
                    <UserImage url={user.imageUrl} size={{width: 100, height: 100, borderRadius: 50}} />

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
        height: 50,
    },
    overviews: {
        flex: 4,
        alignItems: "center",
    },
    contents: {
        flex: 5,
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
});