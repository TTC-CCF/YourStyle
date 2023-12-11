import { Text, View, StyleSheet, ActivityIndicator, Image, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import PostModel from "../../models/PostModel";
import { useUser } from "@clerk/clerk-expo";
import SearchBar from "../../components/SearchBar";
import PostGrid from "../../components/PostGrid";

export default function Feeds({ route, navigation }) {
    const [posts, setPosts] = useState([]);
    const [nextpage, setNextPage] = useState(1);
    const {isLoaded, isSignedIn, user} = useUser();
    const [offset, setOffset] = useState(0);
    const [fetching, setFetching] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (route.params && route.params.update) {
            fetchData(1, append=false);
            navigation.setParams({update: false});
        }
    }, [route.params])

    useEffect(() => {
        fetchData(1, append=false);
    }, [])

    async function fetchData(nextPage, append) {
        if (!nextPage) return undefined;

        if (!isSignedIn) {
            return;
        }
        const post = await PostModel.listPosts(user.id, nextPage);
        
        if (append){
            const newPosts = await post.data.filter((post) => {
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].id === post.id) {
                        return false;
                    }
                }
                return true;
            });
            
            setPosts([...posts, ...newPosts])
        } else {
            setPosts(post.data);
        }
        return post.nextpage;
    }

    async function handleScroll({layoutMeasurement, contentOffset, contentSize}) {
        let currentOffset = contentOffset.y;
        let maxOffset = contentSize.height - layoutMeasurement.height - 130;

        if (offset === 0 && currentOffset < offset) {
            setFetching(true);
            let np = await fetchData(1, append=false);
            setNextPage(np);
            setSearching(false);

        } else if (currentOffset > offset && currentOffset >= maxOffset && !searching) {
            let np = await fetchData(nextpage, append=true);
            setNextPage(np);
        }
        
        setOffset(currentOffset);
    }

    function endScroll() {
        setFetching(false);
    }

    async function handleSearch(keyword) {
        let result = await PostModel.searchPosts(keyword);
        setPosts(result.data);
        setSearching(true);
        setNextPage(1);
    }

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.contentContainer}
                onScroll={({nativeEvent}) => handleScroll(nativeEvent)}
                onMomentumScrollEnd={endScroll}
                scrollEventThrottle={0}
            >
            {posts === undefined ? (
                <>
                    {fetching && <ActivityIndicator/>}
                    <Text>Loading...</Text>
                </>
                ) : (
                <>
                    {posts.length == 0 ? (
                        <>
                            <SearchBar onSearch={handleSearch}/>
                            {fetching && <ActivityIndicator/>}
                            <View style={styles.container}>
                            <Text>There's no posts in your feeds...</Text>

                            </View>
                        </>
                    ) : (
                        <>
                            <SearchBar onSearch={handleSearch}/>
                            {fetching && <ActivityIndicator/>}

                            <PostGrid posts={posts} navigation={navigation}/>
                        </>
                    )}
                </>
            )}
            
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: 'center',
    },
    contentContainer: {
        backgroundColor: "#fff",
        width: Dimensions.get("window").width,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },

});
