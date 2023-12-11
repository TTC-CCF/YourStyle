import express from "express";
import PostController from "../controllers/PostController.js";
import upload, { handleUploadError } from "../middlewares/upload.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();
const postController = new PostController();

router.post("/create", /*ClerkExpressRequireAuth({ secretKey: process.env.CLERK_SECRET_KEY, authorizedParties: ['*']}),*/ upload.single("image"), postController.CreatePost, handleUploadError);
router.get("/list/:id", postController.ListPosts);
router.get("/userposts/:id", postController.GetUserPosts);
router.get("/search", postController.SearchPosts);
router.get("/maybelike/:id", postController.GetMaybeLikePosts);
router.get("/:id", postController.GetPost);
router.put("/click", postController.ClickPost);
router.put("/like", postController.LikeThePost);
router.delete("/:id", ClerkExpressRequireAuth({ authorizedParties: ['*']}), postController.DeletePost);

export default router;