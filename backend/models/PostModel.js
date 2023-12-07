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

    static async getPost(postId) {
        try {
            const post = await Post.findByPk(postId);
            return post;
        } catch (err) {
            console.error('Error getting post:', err);
            throw err;
        }
    }

    static async listPosts(page, limit, recommendlist = null) {
        const offset = (page - 1) * limit; // Calculate the offset based on the current page
        try {
            let posts;
            if (recommendlist === null) {
                posts = await Post.findAll({
                    include: [{
                        model: Tag,
                        as: "tag",
                        attributes: ['name'],
                    }],
                    attributes: ['id', 'user_id', 'title', 'description', 'image_url', 'likes', 'shares'],
                    limit: limit,
                    offset: offset,
                });
            } else {
                posts = await Post.findAll({
                    where: {
                        id: recommendlist, // already paginated
                    },
                    include: [{
                        model: Tag,
                        as: "tag",
                        attributes: ['name'],
                    }],
                    attributes: ['id', 'user_id', 'title', 'description', 'image_url', 'likes', 'shares'],
                });

                posts  = posts.sort((a, b) => {
                    let str_id_a = a.dataValues.id.toString();
                    let str_id_b = b.dataValues.id.toString();
                    return recommendlist.indexOf(str_id_a) - recommendlist.indexOf(str_id_b);
                });
            }
            return posts;
        } catch (err) {
            console.error('Error listing posts:', err);
            throw err;
        }
    }

    static async searchPosts(keyword) {
        try {
            const posts = await Post.findAll({
                where: [{
                    [Sequelize.Op.or]: [
                        {
                            title: {
                                [Sequelize.Op.like]: `%${keyword}%`
                            }
                        },
                        {
                            description: {
                                [Sequelize.Op.like]: `%${keyword}%`
                            }
                        },
                        {
                            "$tag.name$": {
                                [Sequelize.Op.like]: `%${keyword}%`
                            }
                        }
                    ]
                }],
                include: [{
                    model: Tag,
                    as: "tag",
                    attributes: ['name'],
                }],
                attributes: ['id', 'title', 'description', 'image_url'],
            });
            console.log(posts.length)
            return posts;
        } catch (err) {
            console.error('Error searching posts:', err);
            throw err;
        }
    }

    static async deletePost(postId) {
        const transaction = await sequelize_pool.transaction();
        try {
            const post = await Post.findByPk(postId);
            if (post === null) {
                return [1, null];
            }

            await post.destroy();
            
            await User.setDeletedPost(postId)

            await transaction.commit();
            console.log(post);
            return [0, post];
        } catch (error) {
            console.error('Error deleting post:', err);
            await transaction.rollback();
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

Tag.belongsTo(Post, { as: 'tag', foreignKey: 'post_id' });
Post.hasMany(Tag, { as: 'tag', foreignKey: 'post_id' });