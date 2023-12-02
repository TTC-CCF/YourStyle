

export default class UserModel {
    static createUser = async (username, email, id) => {
        console.log(username, email, id);

        const response = await fetch(
            `${process.env.EXPO_PUBLIC_ENDPOINT}/user/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    id,
                }),
            }
        );
        const data = await response.json();
        console.log(data);
        return data;
    }

    static getUserFromClerk = async (id) => {
        console.log(process.env.EXPO_PUBLIC_CLERK_SECRET_KEY)
        const response = await fetch(
            `https://api.clerk.com/v1/users/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.EXPO_PUBLIC_CLERK_SECRET_KEY}`,
                },
            }
        )
        const data = await response.json();
        return data;
    }
}
