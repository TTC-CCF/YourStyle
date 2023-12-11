import { View, Text, StyleSheet } from "react-native";

export default function CalenderPage() {
    return (
        <View style={styles.container}>
            <Text>Calender Page</Text>
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