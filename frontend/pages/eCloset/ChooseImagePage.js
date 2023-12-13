import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import ImageContainer from "../../components/ImageContainer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

export default function ChooseImagePage({ navigation }) {
    const [closet, setCloset] = useState([]);
    const [outfit, setOutfit] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        retrieveData();
    }, []);

    async function handleSelect(idx) {
        if (selected.includes(idx)) {
            setSelected(selected.filter(item => item !== idx));
        } else {
            setSelected([...selected, idx]);
        }
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
            const value = await AsyncStorage.getItem('closet');
            if (value !== null) {
                let _value = JSON.parse(value);
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
            <View style={[styles.block, { flex: 3 }]}>
                <View style={{ height: "50%" }}>
                    <ScrollView
                        horizontal={true}
                    >
                        {closet.map((item, index) => {
                            return (
                                <View key={index}>
                                    {
                                        selected.includes(index) ? (
                                            <TouchableOpacity
                                                onPress={() => handleSelect(index)}
                                            >
                                                <AntDesign name="checkcircle" size={24} color="black" />
                                                <ImageContainer image={item} size={{ width: 200, height: 200 }} />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={() => handleSelect(index)}
                                            >
                                                <ImageContainer image={item} size={{ width: 200, height: 200 }}/>
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
                {selected.length > 0 ? (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Editor", { selected, clothes: closet })}
                    >
                        <Text>拼貼</Text>
                    </TouchableOpacity>
                ) : (

                    <View>
                        <Text>請選擇您的衣服</Text>
                    </View>
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
    }
})