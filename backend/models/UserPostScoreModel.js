import sequelize_pool from "./config.js";
import { DataTypes, Model } from "sequelize";

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
        const transaction = await sequelize_pool.transaction();
        try {
            await UserPostScore.update({
                score: score,
            }, {
                where: {
                    user_id: user_id,
                    post_id: post_id,
                }
            });
            await transaction.commit();
        } catch (err) {
            console.error('Error updating score:', err);
            await transaction.rollback();
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