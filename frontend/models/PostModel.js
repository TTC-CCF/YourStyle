export default class Post {
    static async listPosts() {
        try {
            let response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/post/list`);
            let json = await response.json();
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
}