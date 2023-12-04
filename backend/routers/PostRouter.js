import express from "express";
import PostController from "../controllers/PostController.js";
import upload, { handleUploadError } from "../middlewares/upload.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();
const postController = new PostController();

router.post("/create",ClerkExpressRequireAuth({ secretKey: process.env.CLERK_SECRET_KEY, authorizedParties: ['*']}), upload.single("image"), postController.CreatePost, handleUploadError);
router.get("/list/:id", postController.ListPosts);
router.put("/click", postController.ClickPost);

export default router;