import sequelize_pool from "./config.js";
import { DataTypes, Model, Sequelize } from "sequelize";
import Post from "./PostModel.js"
import Tag from "./TagModel.js";
import LikePost from "./LikePostModel.js";

export default class UserPostScore extends Model {
    static async initNewUserScore(user_id, post_ids) {
        try {

            for (const post_id of post_ids) {
                await UserPostScore.create({
                    user_id: user_id,
                    post_id: post_id,
                    score: 0,
                });
            }


        } catch (err) {
            console.error('Error initializing new user score:', err);
            throw err;

        }
    }

    static async initNewPostScore(post_id, user_ids) {
        try {
            for (const user_id of user_ids) {
                await UserPostScore.create({
                    user_id: user_id,
                    post_id: post_id,
                    score: 0,
                });
            }


        } catch (err) {
            console.error('Error initializing new post score:', err);
            throw err;

        }
    }

    static async updateScore(user_id, post_id, score) {
        try {
            await UserPostScore.update({
                score: Sequelize.literal(`score + ${score}`),
            }, {
                where: {
                    user_id: user_id,
                    post_id: post_id,
                }
            });

        } catch (err) {
            console.error('Error updating score:', err);
            throw err;
        }
    }

    static async maybeLikePosts(userId, similar_users) {
        try {
            const result = await UserPostScore.findAll({
                where: {
                    user_id: similar_users,
                    score: {
                        [Sequelize.Op.gt]: 0,
                    },
                },
            });

            let post_score = [];
            for (const user of similar_users) {
                let data = result.filter(userPostScore => userPostScore.dataValues.user_id === user);
                if (data.length > 0) {
                    let sorted_score = data.sort((a, b) => b.dataValues.score - a.dataValues.score);
                    sorted_score = sorted_score.map(post => ({ postId: post.dataValues.post_id, score: post.dataValues.score }));
                    post_score.push(...sorted_score);
                }
            }

            const recommendPosts = await Post.findAll({
                where: {
                    id: post_score.map(post => post.postId),
                    user_id: {
                        [Sequelize.Op.not]: userId,
                    }
                },
                include: [
                    {
                        model: Tag,
                        as: "tag",
                        attributes: ['name'],
                    },
                    {
                        model: LikePost,
                        as: "likepost",
                        required: false,
                    }
                ],
                order: sequelize_pool.literal(`FIELD(post.id, ${post_score.map(post => post.postId).join(', ')})`),
            })

            return recommendPosts;
        } catch (err) {
            console.error('Error getting maybe like posts:', err);
            throw err;
        }
    }
}

UserPostScore.init(
    {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'post',
                key: 'id'
            }
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize: sequelize_pool,
        modelName: "user_post_score",
        tableName: "user_post_score",
        timestamps: false,
    }
)