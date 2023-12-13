import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import FloatingButton from "../../components/FloatingButton";
import ImageContainer from "../../components/ImageContainer";
import ChooseImagePage from "./ChooseImagePage";

export default function OutfitPage({ navigation }) {
    const [outfit, setOutfit] = useState([]);

    useEffect(() => {
        (async () => {
            // await AsyncStorage.removeItem('outfit');
            const status1 = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const status2 = await ImagePicker.requestCameraPermissionsAsync();

            if (status1.status !== 'granted' || status2.status !== 'granted') {
                Alert.alert('Permission denied', 'You need to enable permission to access the camera roll.');
            }
            await retrieveData();
        })();
    }, []);

    async function handleImage() {
        navigation.navigate("ChooseImage");
    }

    async function storeData(data) {
        try {
            let store;
            if (outfit.length === 0) 
                store = [data];
            else
                store = [...outfit, data];
            await AsyncStorage.setItem('outfit', JSON.stringify(data));
        } catch (e) {
            console.log(e);
        }
    }

    async function retrieveData() {
        try {
            const value = await AsyncStorage.getItem('outfit');

            if (value !== null) {
                setOutfit(JSON.parse(value));
            }
        } catch (e) {
            console.log(e);
        }
    }


    return (
        <View style={styles.container}>
            <ScrollView horizontal={true}>
                {outfit.map((item, index) => (
                    <View key={index} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        {/* <Text>{item.slice(0, 100)}</Text> */}
                        <ImageContainer image={item} size={{width:300, height:400}}/>
                    </View>
                ))}

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
    }
})