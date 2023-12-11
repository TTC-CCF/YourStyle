import sequelize_pool from "./config.js"
import { DataTypes, Model, Sequelize } from "sequelize"
import UserPostScore from "./UserPostScoreModel.js";
import Post from "./PostModel.js";
import Follows from "./FollowsModel.js";

export default class User extends Model {
    static async createUser(id) {
        const transaction = await sequelize_pool.transaction();
        try {
            const user = await this.create({
                id: id,
                role: 'user',
            });

            let posts = await Post.findAll({attributes: ['id']});
            posts = posts.map(post => post.dataValues.id);
            await UserPostScore.initNewUserScore(user.id, posts);

            await transaction.commit();

            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            await transaction.rollback();
            throw error;
        }
    }

    static async getTopUsers(topNum) {
        try {
            const users = await this.findAll({
                attributes: [
                    'id', 
                    [sequelize_pool.literal(`(SELECT COUNT(*) FROM follows WHERE followee_id = user.id)`), 'follower_count']
                ],
                order: sequelize_pool.literal('follower_count DESC'),
                limit: topNum,
            });
            return users;
        } catch (error) {
            console.error('Error getting top users:', error);
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

            await UserPostScore.update({
                score: sequelize_pool.literal('score + 1'),
            }, {
                where: {
                    user_id: userId,
                    post_id: postId,
                }
            
            })

            await transaction.commit();
        } catch (error) {
            console.error('Error updating latest clicked posts:', error);
            await transaction.rollback();
            throw error;
        }
    }

    static async followUser(followerId, followeeId) {
        const transaction = await sequelize_pool.transaction();
        try {
            await Follows.create({
                follower_id: followerId,
                followee_id: followeeId,
            });
            await transaction.commit();
        } catch (error) {
            console.error('Error following user:', error);
            await transaction.rollback();
            throw error;
        }
    }

    static async unfollowUser(followerId, followeeId) {
        const transaction = await sequelize_pool.transaction();
        try {
            const rowDeleted = await Follows.destroy({
                where: {
                    follower_id: followerId,
                    followee_id: followeeId,
                }
            });
            await transaction.commit();

            return rowDeleted;
        } catch (error) {
            console.error('Error following user:', error);
            await transaction.rollback();
            throw error;
        }
    }

    static async getFollowers(userId) {
        try {
            const follows = await Follows.findAll({
                where: {
                    followee_id: userId,
                },
                attributes: ['follower_id'],
            });

            return follows;
        } catch (error) {
            console.error('Error getting follows:', error);
            throw error;
        }
    }

    static async getFollowees(userId) {
        try {
            const follows = await Follows.findAll({
                where: {
                    follower_id: userId,
                },
                attributes: ['followee_id'],
            });

            return follows;
        } catch (error) {
            console.error('Error getting follows:', error);
            throw error;
        }
    }

    static async getFollowerCount(userId) {
        try {
            const followerCount = await Follows.count({
                where: {
                    followee_id: userId,
                },
            });

            return followerCount;
        } catch (error) {
            console.error('Error getting follower count:', error);
            throw error;
        }
    }

    static async getFolloweeCount(userId) {
        try {
            const followeeCount = await Follows.count({
                where: {
                    follower_id: userId,
                },
            });

            return followeeCount;
        } catch (error) {
            console.error('Error getting follower count:', error);
            throw error;
        }
    }

    static async deleteUser(userId) {
        const transaction = await sequelize_pool.transaction();
        try {
            const rowDeleted = await User.destroy({
                where: {
                    id: userId,
                }
            });
            await transaction.commit();

            return rowDeleted;
        } catch (error) {
            console.error('Error updating user:', error);
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
        latest_clicked_posts: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "user",
            allowNull: false,
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        }
    },
    {
        sequelize: sequelize_pool,
        modelName: "user",
        tableName: "user",
        timestamps: false,
    }
)


User.belongsToMany(User, {
    as: 'followees',
    through: Follows,
    foreignKey: 'follower_id',
    otherKey: 'followee_id',
    timestamps: false,
});

User.belongsToMany(User, {
    as: 'followers',
    through: Follows,
    foreignKey: 'followee_id',
    otherKey: 'follower_id',
    timestamps: false,
});