import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ImageContainer from "../../components/ImageContainer";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { captureRef } from 'react-native-view-shot';
import { useRef } from "react";
import { v4 as uuidv4 } from 'uuid';

const Cloth = ({ image }) => {
    const translateX = useSharedValue(50);
    const translateY = useSharedValue(50);
    const drag = Gesture.Pan()
        .onChange((event) => {
            translateX.value += event.changeX;
            translateY.value += event.changeY;
        });

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
            ],
        };
    });


    return (
        <GestureDetector gesture={drag}>
            <Animated.View style={[containerStyle]}>
                <View style={{ width: 250, height: 250 }}>
                    <ImageContainer image={image} size={{ width: 250, height: 250 }} />
                </View>
            </Animated.View>
        </GestureDetector>
    );
}

export default function EditorPage({ route, navigation }) {
    const selected = route.params.selected;
    const clothes = route.params.clothes;
    const dateString = route.params.dateString;
    const imageRef = useRef();

    const onSaveImageAsync = async () => {
        try {
            let imageContent = await captureRef(imageRef, {
                result: 'data-uri',
                quality: 1,
            });

            imageContent = imageContent.replace(/(\r|\n)+/g, "");


            let saved = await AsyncStorage.getItem('outfit');
            if (saved !== null) {
                saved = JSON.parse(saved);
                saved = [...saved, { id: uuidv4(), data: imageContent }];
            } else {
                saved = [{ id: uuidv4(), data: imageContent }];
            }

            await AsyncStorage.setItem('outfit', JSON.stringify(saved));

            if (dateString) {
                const calendar = await AsyncStorage.getItem('calendar');

                let store = {}
                if (calendar !== null) {
                    store = JSON.parse(calendar);
                    store[dateString] = imageContent;
                } else
                    store = { [dateString]: imageContent };

                await AsyncStorage.setItem('calendar', JSON.stringify(store));

                navigation.navigate('Calender', { update: true });
            } else
                navigation.navigate('Outfit', { update: true })

        } catch (e) {
            console.log(e);
        }
    };


    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.imageContainer} collapsable={false}>
                <View ref={imageRef} style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}>
                    {clothes.map((item, index) => {
                        if (selected.includes(index)) {
                            return (
                                <Cloth
                                    key={index}
                                    image={item}
                                />

                            );
                        }
                    })}
                </View>

            </View>

            <View style={[styles.block, { flex: 1 }]}>
                <TouchableOpacity onPress={onSaveImageAsync}>
                    <Text>保存</Text>
                </TouchableOpacity>
            </View>

        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    block: {
        alignItems: "center",
        justifyContent: "center",
    },
    imageContainer: {
        width: "95%",
        height: "80%",
        backgroundColor: "#eee",
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 10,
        marginTop: 10
    }
})