import { View, Text, Image, StyleSheet, Alert, TouchableOpacity, Dimensions } from "react-native";
import { Calendar } from 'react-native-calendars';
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureType, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Zoom } from "react-native-reanimated-zoom";

export default function CalenderPage({ route, navigation }) {
    const [clothes, setClothes] = useState({});

    useEffect(() => {
        retrieveData();
    }, [route.params]);

    async function retrieveData() {
        try {
        // await AsyncStorage.removeItem('calendar');

            const value = await AsyncStorage.getItem('calendar');
            if (value !== null) {
                let _value = JSON.parse(value);
                console.log(Object.keys(_value).length)
                setClothes(_value);
            }
        } catch (e) {
            console.log(e);
        }
    }


    const handleDayPress = day => {
        if (clothes[day.dateString] !== undefined) {
            Alert.alert('穿搭日曆', '', [
                {
                    text: '更換成現有穿搭',
                    onPress: () => { navigation.navigate("ChooseOutfit", { dateString: day.dateString }) }
                },
                {
                    text: '更換成新穿搭',
                    onPress: () => { navigation.navigate("ChooseClothes", { dateString: day.dateString }) }
                },
                {
                    text: '刪除穿搭',
                    onPress: () => { deleteCalendarOutfit(day.dateString) }
                },
                {
                    text: '取消',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ]);
        } else {
            Alert.alert('穿搭日曆', '', [
                {
                    text: '新增現有穿搭',
                    onPress: () => { navigation.navigate("ChooseOutfit", { dateString: day.dateString }) }
                },
                {
                    text: '創造新穿搭',
                    onPress: () => { navigation.navigate("ChooseClothes", { dateString: day.dateString }) }
                },
                {
                    text: '取消',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ]);
        }

    };

    const deleteCalendarOutfit = async (id) => {
        const calendar = await AsyncStorage.getItem('calendar');
        let store = JSON.parse(calendar);
        delete store[id];
        await AsyncStorage.setItem('calendar', JSON.stringify(store));
        setClothes(store);
    }

    const customDayRenderer = ({ date }) => {
        const today = new Date().toISOString().split('T')[0];
        const isToday = date.dateString === today;
        return (
            <TouchableOpacity
                style={[styles.calendarBlock, isToday && styles.today]}
                onLongPress={() => handleDayPress(date)}
            >
                <Text style={[styles.dayText, isToday && styles.todayText]}>{date.day}</Text>
                {clothes[date.dateString] && (
                    <Zoom maximumZoomScale={5}>
                        <Image
                            source={{ uri: clothes[date.dateString] }}
                            style={{ width: 60, height: 100 }}
                            resizeMode="cover"
                        />
                    </Zoom>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <GestureHandlerRootView>
            <View style={{ width: Dimensions.get("window").width, height: Dimensions.get("window").height, backgroundColor: "#fff" }}>
                <Calendar
                    dayComponent={customDayRenderer}

                />
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
    calendarBlock: {
        height: 100,
        width: 50
    },
    today: {
        // Configure your istoday style properties here
        backgroundColor: "#f2f2f2",
        borderRadius: 5,
    },
    todayText: {
        // Configure your todayText style properties here
        color: "red",
        fontWeight: "bold",
    },
    dayText: {
        padding: 5,
    }
})