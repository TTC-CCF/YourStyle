import { Image, TouchableOpacity } from "react-native";
import PostModel from "../models/PostModel";
import { useUser } from "@clerk/clerk-expo";
import UserModel from "../models/UserModel";

export default function PostPreview({post, navigation, size}) {
    const {isLoaded, isSignedIn, user} = useUser();

    async function handleTouch() {
        await PostModel.clickPost(post.id, user.id);

        if (post.user === undefined) {
            post.user = await UserModel.getUser(post.user_id);
        }
        navigation.navigate("PostDetail", { post });
    }

    return (
        <TouchableOpacity onPress={handleTouch}>   
            <Image source={{uri: post.image_url}} style={{width: size.width, height: size.height}} />
        </TouchableOpacity>

    )
}