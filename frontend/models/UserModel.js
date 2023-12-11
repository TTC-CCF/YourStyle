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
        console.log(id);
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/${id}`);
        const data = await response.json();
        return data.data;
    }

    static getUserPosts = async (id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/post/userposts/${id}`);
        const data = await response.json();
        return data.data;
    }

    static deleteUser = async (id) => {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ENDPOINT}/user/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    }
}
