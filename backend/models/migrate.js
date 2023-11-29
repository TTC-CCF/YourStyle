import User from "./UserModel.js"

async function migrate() {
    try {
        await User.sync({ force: true });
    } catch (error) {
        console.log(error);
    }
}

await migrate();