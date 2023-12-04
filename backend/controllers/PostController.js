import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';
import { RemoveS3Images, uploadImageToS3 } from '../services/s3.js'
import fs from 'fs';
import { DataFrame } from 'dataframe-js';

function RemoveImage(file) {
    if (file === undefined) return;
    fs.unlinkSync(file.path);
}

async function GetRecommendedPosts(post_id) {
    let data = [];
    return DataFrame.fromCSV(process.env.SIMILAR_MATRIX_PATH)
    .then(df => {
        return df.select(post_id.toString(), "id").sortBy(post_id.toString(), true).select("id").toArray().flat();
    })

}

export default class PostController {
    
    async CreatePost(req, res) {
        console.log(req.body);
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
            const posts = await Post.findAll();
            const lastedClicked = await User.getLatestClickedPosts(userId);

            if (lastedClicked === null) {
                res.status(200).json(posts);
                return;
            }

            let recommendlist = await GetRecommendedPosts(lastedClicked);
            console.log(recommendlist);

            let orderedPosts = posts.sort((a, b) => {
                const aIndex = recommendlist.indexOf(a.dataValues.id.toString());
                const bIndex = recommendlist.indexOf(b.dataValues.id.toString());
                return aIndex - bIndex;
            });
            
            res.status(200).json(orderedPosts);

        } catch (err) {
            console.error('Error listing posts:', err);
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
            await User.updateLatestClickedPosts(userId, postId);
            res.status(200).json({ message: "Success" });

        } catch (err) {
            console.error('Error clicking post:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
   
}