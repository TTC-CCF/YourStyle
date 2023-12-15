import sequelize_pool from "./config.js"
import { DataTypes, Model } from "sequelize"
import UserPostScore from "./UserPostScoreModel.js";

export default class LikePost extends Model {
    static async likePost(user_id, post_id) {
        const transaction = await sequelize_pool.transaction();
        try {
            await LikePost.create({
                user_id: user_id,
                post_id: post_id,
            });
            await UserPostScore.updateScore(user_id, post_id, 100);

            await transaction.commit();

        } catch (err) {
            console.error('Error liking post:', err);
            await transaction.rollback();
            throw err;
        }
    }
    
    static async unlikePost(user_id, post_id) {
        const transaction = await sequelize_pool.transaction();
        try {
            await LikePost.destroy({
                where: {
                    user_id: user_id,
                    post_id: post_id,
                }
            });
            await UserPostScore.updateScore(user_id, post_id, -100);
            await transaction.commit();

        } catch (err) {
            console.error('Error unliking post:', err);
            await transaction.rollback();
            throw err;
        }
    }
}

LikePost.init(
    {
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: 'user',
                key: 'id'
            },
            primaryKey: true,
        },
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'post',
                key: 'id'
            },
            primaryKey: true,

        },

    },
    {
        sequelize: sequelize_pool,
        modelName: "likepost",
        tableName: "likepost",
        timestamps: false,
    }
)

