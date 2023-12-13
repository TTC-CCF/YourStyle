import { Image, StyleSheet, View } from "react-native";
import { useState } from "react";

export default function ImageContainer ({ image, size}) {

    return (
        <View>
            <Image
                source={{ uri: image }}
                style={size}
            />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});