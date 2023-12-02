import sequelize_pool from "./config.js"
import { DataTypes, Model } from "sequelize"

export default class Tag extends Model {
    static async createTag(name, post_id) {
        try {
            let tag = await Tag.create({
                name: name,
                post_id: post_id,
            });

            
            console.log(tag);
            return tag;

        } catch (err) {
            console.error('Error creating tag:', err);
            throw err;
        }
        
    }
}

Tag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING
        },
        post_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'post',
                key: 'id'
            }
        },

    },
    {
        sequelize: sequelize_pool,
        modelName: "tag",
        tableName: "tag",
        timestamps: false,
    }
)