import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useState } from 'react';
import UserImage from '../../components/UserImage';
import ThreeDot from '../../components/ThreeDot';



const UserBlock = ({ user, actions }) => {
    const [modalVisible, setModalVisible] = useState(false);

    function handlePress() {
        setModalVisible(true);
    }

    function handleClose() {
        setModalVisible(false);
    }

    return (
        <>
            <TouchableOpacity style={styles.userBlock}>
                <View style={{ flex: 1 }}>
                    <UserImage size={{width: 50, height: 50, borderRadius: 25}} url={user.imageUrl} />
                </View>
                <View style={{ flex: 4 }}>
                    <Text style={styles.username}>{user.username}</Text>
                </View>
                <View style={{ flex: 1}}>
                    <ThreeDot onPress={handlePress} onClose={handleClose} actions={actions} modalVisible={modalVisible}/>
                </View>
            </TouchableOpacity>
            
        </>
        
    );

}

export default function FollowsPage({ route, navigation }) {
    const { data, title, actions } = route.params;

    return (
        <View style={styles.container}>
            {data.length === 0 ? (
                    <Text>沒有{title}</Text>
                ) : (
                    <ScrollView>
                        <View style={{width: Dimensions.get('window').width}}></View>
                    {data.map((item) => (
                        <UserBlock key={item.id} user={item} actions={actions} />
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
    
});