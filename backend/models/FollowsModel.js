import sequelize_pool from "./config.js"
import { DataTypes, Model } from "sequelize"

export default class Follows extends Model {}

Follows.init(
    {
        follower_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        followee_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize: sequelize_pool,
        modelName: "follows",
        tableName: "follows",
        timestamps: false,
    }
)