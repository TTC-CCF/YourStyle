import sequelize_pool from "./config.js"
import { DataTypes, Model } from "sequelize"
import UserPostScore from "./UserPostScoreModel.js";
import Post from "./PostModel.js";

export default class User extends Model {
    static async createUser(username, email, id) {
        const transaction = await sequelize_pool.transaction();
        try {
            const user = await this.create({
                id: id,
                username: username,
                email: email,
                role: 'user',
            });

            let posts = await Post.findAll({attributes: ['id']});
            posts = posts.map(post => post.dataValues.id);
            await UserPostScore.initNewUserScore(user.id, posts);

            await transaction.commit();

            console.log('User created:', user.toJSON());
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            await transaction.rollback();
            throw error;
        }
    }

    static async getLatestClickedPosts(userId) {
        try {
            let latestClickedPosts = await User.findOne({
                where: {
                    id: userId
                }, 
                attributes: ['latest_clicked_posts']
            });
            console.log(latestClickedPosts);
            return latestClickedPosts.dataValues.latest_clicked_posts;
        } catch (error) {
            console.error('Error getting latest clicked posts:', error);
            throw error;
        }
    }

    static async updateLatestClickedPosts(userId, postId) {
        const transaction = await sequelize_pool.transaction();
        try {
            await User.update({
                latest_clicked_posts: postId,
            }, {
                where: {
                    id: userId,
                }
            });

            await transaction.commit();
        } catch (error) {
            console.error('Error updating latest clicked posts:', error);
            await transaction.rollback();
            throw error;
        }
    }
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        latest_clicked_posts: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "user",
            allowNull: false,
        },
    },
    {
        sequelize: sequelize_pool,
        modelName: "user",
        tableName: "user",
        timestamps: false,
    }
)