import { View, Text, StyleSheet, TouchableOpacity } from "react-native";


export default function LikeFollowBar() {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Text>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Follow</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});