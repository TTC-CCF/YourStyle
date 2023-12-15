export default class UserModel {
    static createUser = async (id) => {

        const response = await fetch(
            `${process.env.EXPO_PUBLIC_ENDPOINT}/user/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                }),
            }
        );
        const data = await response.json();
        return data;
    }

    static getUser = async (id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/${id}`);
        const data = await response.json();
        return data.data;
    }

    static getUserPosts = async (id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/post/userposts/${id}`);
        const data = await response.json();
        return data.data;
    }

    static getUserFollowers = async (id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/followers/${id}`);
        const data = await response.json();
        return data.data === undefined ? [] : data.data;
    }

    static getUserFollowees = async (id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/followees/${id}`);
        const data = await response.json();
        return data.data === undefined ? [] : data.data;
    }

    static followUser = async (follower_id, followee_id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/follow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                follower_id,
                followee_id,
            }),
        });
        const data = await response.json();
        return data;
    }

    static unfollowUser = async (follower_id, followee_id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/unfollow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                follower_id,
                followee_id,
            }),
        });
        const data = await response.json();
        return data;
    }

    static deleteUser = async (id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    }
}
