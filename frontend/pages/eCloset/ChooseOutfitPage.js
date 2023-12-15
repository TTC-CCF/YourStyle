import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import ImageContainer from "../../components/ImageContainer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

export default function ChooseOutfitpage({ route, navigation }) {
    const [selected, setSelected] = useState(null);
    const [outfit, setOutfit] = useState([]);
    const dateString = route.params.dateString;

    useEffect(() => {

        retrieveData();
    }, []);

    async function handleSelect(idx) {
        if (selected === idx) {
            setSelected(null);
        } else {
            setSelected(idx);
        }
    }

    async function storeData(data) {
        try {
            const calendar = await AsyncStorage.getItem('calendar');
            let store = {};

            if (calendar !== null) {
                store = JSON.parse(calendar);
                store[dateString] = data;

            } else
                store = { [dateString]: data };


            await AsyncStorage.setItem('calendar', JSON.stringify(store));

            navigation.navigate("Calender", { update: true });
        } catch (e) {
            console.log(e);
        }
    }

    async function retrieveData() {
        try {
            const value = await AsyncStorage.getItem('outfit');
            if (value !== null) {
                let _value = JSON.parse(value);
                setOutfit(_value);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.block, { flex: 3 }]}>
                <View style={{ height: "80%" }}>
                    <ScrollView
                        horizontal={true}
                    >
                        {outfit.map((item, index) => {
                            return (
                                <View key={index}>
                                    {
                                        selected === index ? (
                                            <TouchableOpacity
                                                onPress={() => handleSelect(index)}
                                            >
                                                <AntDesign name="checkcircle" size={24} color="black" />
                                                <ImageContainer image={item.data} size={{ width: 300, height: 400 }} />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={() => handleSelect(index)}
                                            >
                                                <ImageContainer image={item.data} size={{ width: 300, height: 500 }} />
                                            </TouchableOpacity>

                                        )
                                    }
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>


            </View>
            <View style={{ flex: 1 }}>
                {selected !== null ? (
                    <TouchableOpacity
                        onPress={() => storeData(outfit[selected].data)}
                        style={[styles.button, { width: 200, backgroundColor: "#000" }]}
                    >
                        <Text style={{color: "#fff"}}>Pick</Text>
                    </TouchableOpacity>
                ) : (

                    <></>
                )}
            </View>

        </View>
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
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 50,
        borderRadius: 10,
        margin: 5,
    }
})