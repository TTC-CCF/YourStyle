import { View, Text, StyleSheet, TouchableOpacity, Dimensions} from "react-native";

export default function ClosetPage() {
    return (
        <View style={styles.container}>
                <View style={styles.section}>
                <View style={styles.block}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.infoText}>衣櫃</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.block}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.infoText}>穿搭日曆</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.block}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.infoText}>我的搭配</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    section: {
        height: "70%",
        width: "100%",
        alignItems: "center",
    },
    block: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: 300
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#DDDDDD",
        width: "100%",
        height: "80%",
        padding: 10,
        borderWidth: 5,
        borderRadius: 15,
    },
    infoText: {
        fontSize: 30,
        fontWeight: "bold",
    }
})