import { View, Text, StyleSheet } from "react-native";

export default function ClosetPage() {
    return (
        <View style={styles.container}>
            <Text>Closet Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})