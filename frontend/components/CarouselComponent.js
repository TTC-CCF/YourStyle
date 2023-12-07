import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import PostComponent from "./PostComponent";
import { useEffect } from "react";

export default function CarouselComponent({title, blocks, navigation}) {
    useEffect(() => {
        console.log(blocks)
    }, [])
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.title}>{title}</Text>
            <Carousel
                loop
                width={Dimensions.get("window").width}
                height={400}
                autoPlay={true}
                data={[...Array(blocks.length).keys()]}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => console.log('current index:', index)}
                renderItem={({ index }) => {
                    return (
                        <View style={styles.container}>
                        <PostComponent post={blocks[index]} navigation={navigation} size={({width: Dimensions.get("window").width * 0.8, height: 400})} />
                        </View> 
                    )
                
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
});