import { Text, View, StyleSheet, Button, TouchableOpacity, TextInput, Image, Keyboard, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import PostModel from "../../models/PostModel";
import * as ImagePicker from 'expo-image-picker';
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";


export default function Post({ navigation }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);
    const { user } = useUser();
    const { getToken } = useAuth();

    const imagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        } else {
            setImage(null);
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
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { flex: 1 }]}>Create New Post</Text>
                <View style={[styles.imageContainer, { flex: 3 }]}>
                    {image ? (
                        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                    ) : (
                        <View style={[{ flex: 1 }]}>
                            <TouchableOpacity style={styles.button} onPress={imagePick}>
                                <Text style={styles.buttonText}>Pick an image</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={[{ flex: 1 }]}>
                    <TextInput
                        value={title}
                        placeholder="Title..."
                        placeholderTextColor="#000"
                        onChangeText={(title) => setTitle(title)}
                        style={styles.textInput}
                    />
                </View>
                <View style={[{ flex: 1 }]}>
                    <TextInput
                        onBlur={() => { Keyboard.dismiss() }}
                        multiline
                        value={description}
                        placeholder="Description..."
                        placeholderTextColor="#000"
                        onChangeText={(description) => setDescription(description)}
                        style={styles.textInput}
                    />

                </View>
                {tags.map((input, index) => (
                    <View style={[{ flex: 1 }]} key={index}>
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

                <View style={[{ flex: 1 }]}>

                    <Button
                        title="Add tags"
                        onPress={addTextInput}
                    />
                </View>




                <View style={[{ flex: 1 }]}>
                    <Button
                        title="Create Post"
                        onPress={async () => {
                            navigation.navigate("Profile");
                            await PostModel.createPost(title, description, user.id, tags, image, token);
                            const token = await getToken();

                        }}
                    />
                </View>
                <View style={{ height: 400 }}></View>
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
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        color: "#fff",
    },
    button: {
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
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