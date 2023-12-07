import { View, Text, StyleSheet } from "react-native";

export default function ClosetPage() {
    return (
        <View 
            style={style.container}
        >
            <Text>Closet Page</Text>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})