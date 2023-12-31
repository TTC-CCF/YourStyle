import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';
import { RemoveS3Images, uploadImageToS3, getImageKey } from '../services/s3.js'
import fs from 'fs';
import { exec } from 'child_process';
import { DataFrame } from 'dataframe-js';
import UserPostScore from '../models/UserPostScoreModel.js';
import { users } from "@clerk/clerk-sdk-node";
import LikePost from '../models/LikePostModel.js';

function RemoveImage(file) {
    if (file === undefined) return;
    fs.unlinkSync(file.path);
}

async function GetIBRecommendedPosts(post_id) {
    return DataFrame.fromCSV(process.env.ITEM_SIMILAR_MATRIX_PATH)
    .then(async df => {
        if (df.listColumns().includes(post_id.toString())) {
            return df.select(post_id.toString(), "id").sortBy(post_id.toString(), true).select("id").toArray().flat();
        } else {
            post_id = await Post.findOne()
            post_id = post_id.dataValues.id;
            return df.select(post_id.toString(), "id").sortBy(post_id.toString(), true).select("id").toArray().flat();
        }
    })
}

function BuildIBModel() {
    const PYTHON_SCRIPT_PATH = './ai_model/Itembased/build_similar_matrix.py';

    exec(`python ${PYTHON_SCRIPT_PATH}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}

async function GetUBSimilarUsers(user_id) {
    return DataFrame.fromCSV(process.env.USER_SIMILAR_MATRIX_PATH)
    .then(async df => {
        if (df.listColumns().includes(user_id.toString())) {
            return df.select(user_id.toString(), "user_id").sortBy(user_id.toString(), true).select("user_id").toArray().flat().filter(id => id !== user_id);
        } else {
            user_id = await User.findOne()
            user_id = user_id.dataValues.id;
            return df.select(user_id.toString(), "user_id").sortBy(user_id.toString(), true).select("user_id").toArray().flat().filter(id => id !== user_id);
        }
    })

}

export default class PostController {
    
    async CreatePost(req, res) {
        console.log(req.file);
        if (req.body == undefined || req.body.title == null || req.body.description == null || req.body.user_id == null) {
            res.status(400).json({ message: "Bad Request" });
            RemoveImage(req.file);
            return;
        }
        try {
            let image_url = null;
            if (req.file !== undefined) {
                console.log(req.file)
                image_url = await uploadImageToS3(req.file);
                RemoveImage(req.file);
            }

            const post = await Post.createPost(req.body.title, req.body.description, req.body.user_id, req.body.tags, image_url);

            BuildIBModel(); // build consine similarity matrix

            res.status(200).json(post);

        } catch (err) {
            console.error('Error creating post:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }

    }

    async ListPosts(req, res) {
        try {
            if (req.params === undefined || req.params.id === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.params.id;
            const limit = 12;
            const page = parseInt(req.query.page) || 1;
            const lastedClicked = await User.getLatestClickedPosts(userId);
            let recommendlist, result;

            if (lastedClicked !== null) {
                recommendlist = await GetIBRecommendedPosts(lastedClicked)
                console.log(recommendlist);
                result = await Post.listPosts(userId, page, limit, recommendlist);
            } else {
                result = await Post.listPosts(userId, page, limit);
            }

            if (result === null || result.length === 0) {
                res.status(404).json({ message: "Posts not found" });
                return;
            }

            const test_result = await Post.listPosts(userId, page+1, limit);
            if (test_result === null || test_result.length === 0) {
                res.status(200).json({data: result});
            } else {
                res.status(200).json({data: result, nextpage: page+1});
            }

        } catch (err) {
            console.error('Error listing posts:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async GetUserPosts(req, res) {
        try {
            if (req.params === undefined || req.params.id === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.params.id;
            const posts = await Post.getUserPosts(userId);

            if (posts === null || posts.length === 0) {
                res.status(404).json({ message: "Posts not found" });
                return;
            }

            res.status(200).json({data: posts});

        } catch (err) {
            console.error('Error getting user posts:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async ClickPost(req, res) {
        try {
            if (req.body === undefined || req.body.userId === undefined || req.body.postId === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.body.userId;
            const postId = parseInt(req.body.postId);
            await User.updateLatestClickedPosts(userId, postId); // this will update the score in user_post_score table
            res.status(200).json({ message: "Success" });

        } catch (err) {
            console.error('Error clicking post:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async GetPost(req, res) {
        try {
            if (req.params === undefined || req.params.id === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const postId = req.params.id;
            const post = await Post.getPost(postId);
            if (post === null) {
                res.status(404).json({ message: "Post not found" });
            } else {
                res.status(200).json(post);
            }

        } catch (err) {
            console.error('Error getting post:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async SearchPosts(req, res) {
        try {
            if (req.query === undefined || req.query.keyword === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const keyword = req.query.keyword;
            const posts = await Post.searchPosts(keyword);

            if (posts === null || posts.length === 0) {
                res.status(404).json({ message: "Posts not found" });
                return;
            }
            
            res.status(200).json({data: posts});
        } catch (err) {
            console.error('Error searching post:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async DeletePost(req, res) {
        try {
            if (req.params === undefined || req.params.id === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const postId = req.params.id;

            const post = await Post.deletePost(postId);
            if (post === 0) {
                res.status(404).json({ message: "Post not found" });
                return;
            }

            const image_key = getImageKey(post.image_url);

            BuildIBModel(); // build consine similarity matrix

            await RemoveS3Images(image_key);

            res.status(200).json({ message: "Success" });

        } catch (err) {
            console.error('Error deleting post:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
    async LikeThePost(req, res) {
        // add 10 to the score
        try {
            if (req.body === undefined || req.body.userId === undefined || req.body.postId === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.body.userId;
            const postId = parseInt(req.body.postId);

            await LikePost.likePost(userId, postId);

            res.status(200).json({ message: "Success" });
        } catch (err) {
            console.error('Error liking post:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async UnlikeThePost(req, res) {
        try {
            if (req.body === undefined || req.body.userId === undefined || req.body.postId === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.body.userId;
            const postId = parseInt(req.body.postId);
            await LikePost.unlikePost(userId, postId);

            res.status(200).json({ message: "Success" });
        } catch (err) {
            console.error('Error liking post:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async GetMaybeLikePosts(req, res) {
        try {
            if (req.params === undefined || req.params.id === undefined) {
                res.status(400).json({ message: "Bad Request" });
                return;
            }

            const userId = req.params.id;
            const similar_users = await GetUBSimilarUsers(userId);
            const result = await UserPostScore.maybeLikePosts(userId, similar_users);


            if (result === null || result.length === 0) {
                res.status(404).json({ message: "Posts not found" });
                return;
            }

            let posts = result.map(post => post.toJSON());

            let userIds = [...new Set(posts.map(post => post.user_id))]
            let _users = [];
            
            for (const id of userIds) {
                const user = await users.getUser(id);
                _users.push(user);
            }

            for (const post of posts) {
                const user = _users.find(user => user.id === post.user_id);
                post.user = user;
            }

            res.status(200).json({data: posts});
        } catch (err) {
            console.error('Error getting maybe like posts:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}