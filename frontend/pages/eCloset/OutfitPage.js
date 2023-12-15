import { FlatList, View, Text, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from "react";
import FloatingButton from "../../components/FloatingButton";
import ImageContainer from "../../components/ImageContainer";
import { Zoom, createZoomListComponent } from "react-native-reanimated-zoom";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CarouselComponent from "../../components/CarouselComponent";

const ZoomFlatList = createZoomListComponent(FlatList);

export default function OutfitPage({ route, navigation }) {
    const [outfit, setOutfit] = useState([]);

    useEffect(() => {
        retrieveData();
        return () => {
            console.log("clean up");
            setOutfit([]);
        }
    }, [route.params]);
    async function handleImage() {
        navigation.navigate("ChooseClothes");
    }

    async function retrieveData() {
        try {
            const value = await AsyncStorage.getItem('outfit');
            console.log(outfit.length)
            if (value !== null) {
                let _value = JSON.parse(value);
                setOutfit(_value);
                console.log(`value length: ${_value.length}`);

            }
        } catch (e) {
            console.log(e);
        }
    }

    async function showInfo(id) {
        Alert.alert('確定刪除?', '', [
            {
                text: '確定',
                onPress: () => { deleteImage(id) }
            },
            {
                text: '取消',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
        ]);
    }

    async function deleteImage(id) {
        let _outfit = outfit.filter((item) => item.id !== id);
        setOutfit(_outfit);
        await AsyncStorage.setItem("outfit", JSON.stringify(_outfit));
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={{ height: "80%" }}>
                <ZoomFlatList
                    data={outfit}
                    renderItem={({ item }) => {
                        return (
                            <Zoom maximumZoomScale={2}>
                                <TouchableOpacity onLongPress={() => showInfo(item.id)}>
                                    <ImageContainer image={item.data} size={{ width: 300, height: 500 }} />
            
                                </TouchableOpacity>
                            </Zoom>
                        );
                    }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <FloatingButton onPress={handleImage} />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
})