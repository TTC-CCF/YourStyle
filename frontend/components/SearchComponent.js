import PostModel from "../models/PostModel";
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableWithoutFeedback } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';


export default function SearchComponent({ onSearch }) {
    const [isFocused, setIsFocused] = useState(false);
    const [searchText, setSearchText] = useState("");

    function handleFocus() {
        setIsFocused(true);
    }

    function handleBlur() {
        setIsFocused(false);
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={{
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    paddingLeft: 10,
                    marginBottom: 16, 
                    marginTop: 16,
                    width: "95%",
                }}
                placeholder="Search..."
                value={searchText}
                onFocus={handleFocus}
                onChangeText={setSearchText}
            />
            {isFocused && (
                <Icon 
                    name="search"
                    size={30} 
                    style={{ position: "absolute", right: 20 }}
                    onPress={() => {
                        onSearch(searchText);
                        setSearchText("");
                        // Clear the text input value
                    }}
                />
            )}
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
});