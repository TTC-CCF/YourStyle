import { ScrollView, View, Dimensions, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import RemoveBg from '../../models/RemoveBg';
import FloatingButton from "../../components/FloatingButton";
import ImageContainer from "../../components/ImageContainer";

export default function ClosetPage() {
    const [closet, setCloset] = useState([]);

    useEffect(() => {
        (async () => {
            const status1 = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const status2 = await ImagePicker.requestCameraPermissionsAsync();

            if (status1.status !== 'granted' || status2.status !== 'granted') {
                Alert.alert('Permission denied', 'You need to enable permission to access the camera roll.');
            }
            await retrieveData();
        })();
    }, []);

    async function handleImage() {
        Alert.alert('選擇照片', '', [
            {
                text: '相機',
                onPress: () => { pickImage('camera') }
            },
            {
                text: '照片圖庫',
                onPress: () => { pickImage('library') }
            },
            {
                text: '取消',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
        ]);

    }

    async function pickImage(type) {
        let result;

        if (type === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
                saveToPhotos: true,
            });
        } else if (type === 'library') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
        }

        if (!result.canceled) {
            console.log(result.assets[0].uri);
            const base64image = await RemoveBg.removeBackground(result.assets[0].uri);
            await storeData(`data:image/png;base64,${base64image}`);
            await retrieveData();
        }
    }

    function showInfo(item){
        Alert.alert('確定刪除?', '', [
            {
                text: '確定',
                onPress: () => {deleteImage(item)}
            },
            {
                text: '取消',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
        ]);
    }

    async function deleteImage(item){
        const _closet = closet.filter(image => item.includes(image) === false );
        setCloset(_closet);
        await AsyncStorage.setItem("closet", JSON.stringify(_closet));
    }

    async function storeData(data) {
        try {
            let store;

            if (closet.length === 0)
                store = [data];
            else
                store = [...closet, data];

            const jsonString = JSON.stringify(store);

            await AsyncStorage.setItem("closet", jsonString);

        } catch (error) {
            console.log(error);
        }
    }

    async function retrieveData() {
        try {
            const value = await AsyncStorage.getItem('closet');
            if (value !== null) {
                let _value = JSON.parse(value);
                console.log(_value[0].slice(0, 100))
                _value = _value.map(item => {
                    return item.includes("data:image/png;base64,") ? item : `data:image/png;base64,${item}`;
                })

                setCloset(_value);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
            contentContainerStyle={{alignItems: "center", justifyContent: "center"}}
            >
                <View style={{width: Dimensions.get("window").width}}></View>
                {closet.map((item, index) => {
                    return (
                        <View key={index}>
                            <TouchableOpacity onPress={() => showInfo(item)}>
                                <ImageContainer image={item} size={{width: 200, height: 200}}/>

                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
            <FloatingButton onPress={handleImage} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

})