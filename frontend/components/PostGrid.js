import { View, Dimensions } from "react-native";
import PostPreview from "./PostPreview";

export default function PostGrid({ posts, navigation }) {
    function chunckArray(myArray, chunk_size){
        var index = 0;
        var arrayLength = myArray.length;
        var tempArray = [];
        
        if (arrayLength <= chunk_size) {
            return [myArray];
        }

        for (index = 0; index < arrayLength; index += chunk_size) {
            let myChunk = myArray.slice(index, index+chunk_size);
            tempArray.push(myChunk);
        }
    
        return tempArray;
    }

    return ( 
        <>
        {posts && posts.length !== 0 ? (
            <>
            {chunckArray(posts, 3).map((posts, index) => (
            <View key={index} style={{flexDirection: "row"}}>
                {posts.map((post, index) => (
                    <View style={{padding: 1}} key={index}>
                        <PostPreview post={post} navigation={navigation} size={({width: Dimensions.get("window").width/3, height: 200})} />
                    </View>
                ))}
            </View>
            ))}
            </>
        ) : (
            <></>
        )}
        </>
        
    )
}