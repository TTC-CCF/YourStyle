import { Image, View, StyleSheet, Text } from "react-native";

export default function UserImage({ url, size }) {
    return (
        <Image
            style={[styles.image, size]}
            source={{
                uri: url,
            }}
        />
    )
}

const styles = StyleSheet.create({
    image: {
        borderWidth: 2,
        borderColor: "#eee",
    }
});
