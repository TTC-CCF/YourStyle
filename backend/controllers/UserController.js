import User from '../models/UserModel.js'

export default class UserController {

    async CreateUser(req, res) {
        console.log(req.body);
        if (req.body == undefined || req.body.username == null || req.body.email == null || req.body.id == null) {
            res.status(400).json({ message: "Bad Request" });
            return;
        }
        try {
            const user = await User.createUser(req.body.username, req.body.email, req.body.id);
            res.status(200).json(user);

        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }

    }

}