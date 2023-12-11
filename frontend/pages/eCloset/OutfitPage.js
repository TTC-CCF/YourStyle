import { View, Text, StyleSheet } from "react-native";

export default function OutfitPage() {
    return (
        <View style={styles.container}>
            <Text>Outfit Page</Text>
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