import sequelize_pool from "./config.js"
import { DataTypes, Model, Sequelize } from "sequelize"
import User from "./UserModel.js"
import Tag from "./TagModel.js"
import UserPostScore from "./UserPostScoreModel.js"

export default class Post extends Model {
    static async createPost(title, description, user_id, tags, image_url) {
        let transaction = await sequelize_pool.transaction();
        try {
            let post = await Post.create({
                title: title,
                description: description,
                user_id: user_id,
                image_url: image_url,
                likes: 0,
                shares: 0,
            });

            for (const tag of tags) {
                await Tag.createTag(tag, post.id);
            }

            let users = await User.findAll({attributes: ['id']});
            users = users.map(user => user.dataValues.id);
            await UserPostScore.initNewPostScore(post.id, users);

            if (transaction) await transaction.commit();
            
            console.log(post);
            return post;

        } catch (err) {
            console.error('Error creating post:', err);
            if (transaction) {
                await transaction.rollback();
            }
            throw err;
        }
        
    }
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING(1000),
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            }
        },
        image_url: {
            type: DataTypes.STRING,
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        shares: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        sequelize: sequelize_pool,
        modelName: "post",
        tableName: "post",
        timestamps: true,
    }
)
