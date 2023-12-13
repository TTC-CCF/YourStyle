import { Text, View, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import PostPreview from "./PostPreview";
import { useUser } from "@clerk/clerk-expo";
import UserPreview from "./UserPreview";
import UserImage from "./UserImage";

export default function CarouselComponent({title, blocks, size, type, navigation}) {
    const { isLoaded, isSignedIn, user } = useUser();

    function gotoUserDetail(_user) {
        let navigateTo = "UserDetail";
        if (user.id === _user.id) navigateTo = "Profile";
        
        if (_user.username)
            navigation.navigate(navigateTo, {user: _user, username: _user.username});
        else 
            navigation.navigate(navigateTo, {user: _user, username: _user.firstName + " " + _user.lastName});
    }

    return (
        <View style={{ margin: 10 }}>
            <Text style={styles.title}>{title}</Text>
            {type === "post" ? (
                <Carousel
                    loop
                    width={size.width}
                    height={size.height + 5}
                    autoPlay={true}
                    data={blocks}
                    scrollAnimationDuration={1000}
                    renderItem={({ index }) => {
                        return (
                            <View style={styles.container}>
                                <View style={styles.postCard}>
                                    <PostPreview post={blocks[index]} navigation={navigation} size={({width: size.width * 0.7, height: size.height * 0.9})} />
                                    <UserPreview user={blocks[index].user} follow={false} size={({width: size.width * 0.7, height: size.height * 0.1})} navigation={navigation} />
                                </View>
                            </View> 
                        )
                    
                    }}
                />
            ) : (
                <>
                {type === "topUsers" ? (
                    <View style={{height: size.height, width: size.width - 20}}>
                        <ScrollView 
                            horizontal={true}
                            contentContainerStyle={styles.contentContainer}
                            
                        >
                        {blocks.map((user, index) => {
                            return (
                                <TouchableOpacity onPress={() => gotoUserDetail(user)} style={styles.container} key={index}>
                                    <UserImage url={user.imageUrl} size={{width: 50, height: 50, borderRadius: 25}}/>
                                    {user.username ? (
                                        <Text style={styles.title}>{user.username}</Text>
                                    ) : (
                                        <Text style={styles.title}>{user.firstName} {user.lastName}</Text>
                                    )}
                                    <Text>粉絲 {user.follower_count}</Text>
                                </TouchableOpacity> 
                            )
                        })}
                        </ScrollView>
                    </View>
                    
                ) : (
                    <></>
                )}
                </>
            )}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 1,
        alignItems: "center",
    },
    contentContainer: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    postCard: {
        borderWidth: 2,
        borderRadius: 10,
        overflow: "hidden",
        borderColor: "#eee",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        padding: 10,
    },
});