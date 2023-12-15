import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import UserImage from '../../components/UserImage';
import ThreeDot from '../../components/ThreeDot';
import { useUser } from '@clerk/clerk-expo';
import UserModel from '../../models/UserModel';



const UserBlock = ({ user, action, navigation, refresh }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isFollow, setIsFollow] = useState(true);
    const _user = useUser();
    const currentUser = _user.user;

    function gotoUserDetailPage() {
        if (currentUser.id === user.id)
            navigation.navigate("Profile");
        else if (user.username)
            navigation.navigate("UserDetail", { user, username: user.username });
        else
            navigation.navigate("UserDetail", { user, username: user.firstName + " " + user.lastName });
    }

    function handlePress() {
        setModalVisible(true);
    }

    function handleClose() {
        setModalVisible(false);
    }

    async function followUser() {
        const result = await UserModel.followUser(currentUser.id, user.id);
        setIsFollow(true);
    }

    async function unfollowUser() {
        let result;
        if (action === "取消追蹤") {
            result = await UserModel.unfollowUser(currentUser.id, user.id);
            setIsFollow(false);
        }
        else if (action === "移除粉絲") {
            result = await UserModel.unfollowUser(user.id, currentUser.id);
            refresh();
        }
    }

    return (
        <>
            <TouchableOpacity style={styles.userBlock} onPress={gotoUserDetailPage}>
                <View style={{ flex: 1 }}>
                    <UserImage size={{ width: 50, height: 50, borderRadius: 25 }} url={user.imageUrl} />
                </View>
                <View style={{ flex: 4 }}>
                    {user.username === null ? (
                        <Text style={styles.username}>{user.firstName} {user.lastName}</Text>
                    ) : (
                        <Text style={styles.username}>{user.username}</Text>
                    )}
                </View>
                {isFollow ? (
                    <View style={{ margin: 10 }}>
                        <TouchableOpacity style={styles.followButton} onPress={unfollowUser}>
                            <Text style={{ padding: 5 }}>{action}</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ margin: 10 }}>
                        <TouchableOpacity style={styles.followButton} onPress={followUser}>
                            <Text style={{ padding: 5 }}>追蹤</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={{ margin: 10 }}>

                </View>

            </TouchableOpacity>

        </>

    );

}

export default function FollowsPage({ route, navigation }) {
    const [data, setData] = useState(route.params.data);
    const { title, action } = route.params;

    async function refresh() {
        const result = await UserModel.getUserFollowees();
        setData(result);
    }

    return (
        <View style={styles.container}>
            {data.length === 0 ? (
                <Text>沒有{title}</Text>
            ) : (
                <ScrollView>
                    <View style={{ width: Dimensions.get('window').width }}></View>
                    {data.map((item) => (
                        <UserBlock key={item.id} user={item} action={action} navigation={navigation} refresh={refresh} />
                    ))}
                </ScrollView>
            )}

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: '#fff',
    },
    userBlock: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        margin: 10,
    },
    username: {
        marginLeft: 10,
        fontSize: 20,
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