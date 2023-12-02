import { Text, View, StyleSheet, Button, TextInput, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import PostModel from "../../models/PostModel";
import { useUser, useAuth } from "@clerk/clerk-expo";
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export default function Post() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);
    const {isLoaded, isSignedIn, user} = useUser();
    const { getToken } = useAuth();

    const imagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const addTextInput = () => {
        setTags([...tags, ""]);
    }
    const removeTextInput = (index) => {
        const updatedInputs = [...tags];
        updatedInputs.splice(index, 1);
        setTags(updatedInputs);
    };

    const handleTagsInputChange = (index, value) => {
        const updatedInputs = [...tags];
        updatedInputs[index] = value;
        setTags(updatedInputs);
    }

    return (
        <View style={styles.container}>
            <ScrollView>
            <Text style={styles.title}>Create New Post</Text>
            <TextInput
                value={title}
                placeholder="Title..."
                placeholderTextColor="#000"
                onChangeText={(title) => setTitle(title)}
                style={styles.textInput}
            />
            <TextInput
                value={description}
                placeholder="Description..."
                placeholderTextColor="#000"
                onChangeText={(description) => setDescription(description)}
                style={styles.textInput}
            />
            
            {tags.map((input, index) => (
                <View style={styles.tagContainer} key={index}>
                    <TouchableOpacity onPress={() => removeTextInput(index)}>
                        <Ionicons name="close-circle-outline" size={24} color="red" />
                    </TouchableOpacity>
                    <TextInput
                        value={input}
                        placeholder="Tag..."
                        placeholderTextColor="#000"
                        onChangeText={(value) => handleTagsInputChange(index, value)}
                        style={styles.textInput}
                    />
                </View>
            ))}
            
            <Button
                title="Add tags"
                onPress={addTextInput}
            />
            <Button
                title="Pick an image from camera roll"
                onPress={imagePick}
            />
            {image && <Image source={{uri: image}} style={{width: 200, height: 200}} />}
            <Button
                title="Create Post"
                onPress={async () => {
                    const token = await getToken();
                    await PostModel.createPost(title, description, user.id, tags, image, token);
                }}
            />
            </ScrollView>
        </View>
    )
};


const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
    textInput: {
        width: 300,
        height: 50,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});