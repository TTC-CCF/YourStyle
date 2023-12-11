export default class PostModel {
    static async listPosts(userId, nextPage) {
        try {
            let response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/post/list/${userId}?page=${nextPage}`);
            let json = await response.json();
            if (json.data === undefined) json = {data: []};
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    static async createPost(title, description, user_id, tags, image_path, token) {
        try {
            const formdata = new FormData();
            const image_type = image_path.split(".").pop();
            formdata.append("image", {
                uri: image_path,
                type: `image/${image_type}`,
                name: `image.${image_type}`,
            });
            formdata.append("title", title);
            formdata.append("description", description);
            formdata.append("user_id", user_id);
            for (const tag of tags) {
                formdata.append("tags[]", tag);
            }

            let response = await fetch(
                `${process.env.EXPO_PUBLIC_ENDPOINT}/post/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formdata,
                }
            );
            let json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error);
        }
    }

    static async clickPost(postId, userId) {
        try {
            let response = await fetch(
                `${process.env.EXPO_PUBLIC_ENDPOINT}/post/click`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        postId,
                        userId,
                    }),
                }
            );
            let json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error);
        }
    }

    static async getPost(postId) {
        try {
            let response = await fetch (`${process.env.EXPO_PUBLIC_ENDPOINT}/post/${postId}`)
            let json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    static async deletePost(postId, token) {
        try {
            let response = await fetch(
                `${process.env.EXPO_PUBLIC_ENDPOINT}/post/${postId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            let json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    static async getRecommendation(userId) {
        try {
            let response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/post/maybelike/${userId}`);
            let json = await response.json();
            if (json.data === undefined) json = {data: []};
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    static async searchPosts(keyword) {
        try {
            let response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/post/search?keyword=${keyword}`);
            let json = await response.json();
            if (json.data === undefined) json = {data: []};
            return json;
        } catch (error) {
            console.error(error);
        }
    }

    static async getTopUsers() {
        try {
            let response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/topusers`);
            let json = await response.json();

            if (json.data === undefined) json = {data: []};
            return json;
        } catch (error) {
            console.error(error);
        }
    }

}

