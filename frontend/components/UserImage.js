import { Image, View, StyleSheet, Text } from "react-native";

export default function UserImage({url, size}) {
    return (
        <View style={{ margin: 5}}>
            <Image
                style={[styles.image, size]}
                source={{
                    uri: url,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        borderWidth: 2,
        borderColor: "#eee",
    }
});
