import Post from '../models/PostModel.js';
import multer from "multer";
import { RemoveS3Images, uploadImageToS3 } from '../services/s3.js'
import fs from 'fs';

function RemoveImage(file) {
    if (file === undefined) return;
    fs.unlinkSync(file.path);
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
            const posts = await Post.findAll();
            console.log(posts);
            res.status(200).json(posts);

        } catch (err) {
            console.error('Error listing posts:', err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    
}