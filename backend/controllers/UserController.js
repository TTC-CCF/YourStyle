import User from '../models/UserModel.js'
import { users } from "@clerk/clerk-sdk-node";

export default class UserController {

    async GetTopUsers(req, res) {
        try {
            const result = await User.getTopUsers(10);
            const userIds = result.map(user => user.dataValues.id);
            let _users = await users.getUserList({
                userId: userIds,
            });

            _users = _users.sort((a, b) => {
                return userIds.indexOf(a.id) - userIds.indexOf(b.id);
            });

            res.status(200).json({ data: _users});
        } catch (err) {
            console.error('Error getting top users:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async GetUser(req, res) {
        try {
            if (req.params === undefined || req.params.id === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.params.id;
            let user = await users.getUser(userId);

            const followeeCount = await User.getFolloweeCount(userId);
            const followerCount = await User.getFollowerCount(userId);
            
            user.followee_count = followeeCount;
            user.follower_count = followerCount;

            res.status(200).json({ data: user });
        } catch (err) {
            console.error('Error getting user:', err);
            if ("Not Found" === err.message)
                res.status(404).json({ message: "User not found" });
            else 
                res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async GetFollowers(req, res) {
        try {
            if (req.params === undefined || req.params.id === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.params.id;
            const result = await User.getFollowers(userId);

            if (result === null || result.length === 0) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const userIds = result.map(follower => follower.dataValues.follower_id);

            let followers = await users.getUserList({
                userId: userIds,
            });

            res.status(200).json({ data: followers });
        } catch (err) {
            console.error('Error getting followers:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async GetFollowees(req, res) {
        try {
            if (req.params === undefined || req.params.id === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.params.id;
            const result = await User.getFollowees(userId);

            if (result === null || result.length === 0) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const userIds = result.map(followee => followee.dataValues.followee_id);

            let followees = await users.getUserList({
                userId: userIds,
            });

            res.status(200).json({ data: followees });
        } catch (err) {
            console.error('Error getting followees:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async CreateUser(req, res) {
        console.log(req.body);
        if (req.body == undefined 
            || req.body.id == null) {
            res.status(400).json({ message: "Bad Request" });
            return;
        }
        try {
            const user = await User.createUser(req.body.id);
            res.status(200).json(user);

        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }

    }

    async FollowUser(req, res) {
        try {
            if (req.body == undefined 
                || req.body.follower_id == undefined 
                || req.body.followee_id == undefined
                ) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const followerId = req.body.follower_id;
            const followeeId = req.body.followee_id;
            await User.followUser(followerId, followeeId);
            res.status(200).json({ message: "Success" });

        } catch (err) {
            console.error('Error getting user:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async UnfollowUser(req, res) {
        try {
            if (req.body == undefined 
                || req.body.follower_id == undefined 
                || req.body.followee_id == undefined
                ) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const followerId = req.body.follower_id;
            const followeeId = req.body.followee_id;
            const rowDeleted = await User.unfollowUser(followerId, followeeId);

            if (rowDeleted === 0) {
                res.status(404).json({ message: "User not found" });
                return;
            } else {
                res.status(200).json({ message: "Success" });
            }

        } catch (err) {
            console.error('Error getting user:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async UpdateUserHeight(req, res) {
        try {
            if (req.body == undefined 
                || req.body.id == undefined
                || req.body.height == undefined
                ) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.body.id;
            const height = req.body.height;
            const user = await User.updateUserHeight(userId, height);
            
            if (user === null || user.length === 0) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json(user);
            }

        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    async DeleteUser(req, res) {
        try {
            if (req.params == undefined 
                || req.params.id == undefined
                ) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.params.id;
            console.log(userId)
            const user = await User.deleteUser(userId);
            const result = await users.deleteUser(userId);
            console.log(result)
            if (user === null || user.length === 0) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json(user);
            }

        } catch (err) {
            console.error('Error updating user:', err);
            if (err.message === "Not Found")
                res.status(404).json({ message: "User not found" });
            else
                res.status(500).json({ message: "Internal Server Error" });
        }
    }

}