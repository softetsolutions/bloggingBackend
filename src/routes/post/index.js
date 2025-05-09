import express from 'express';
import { createPost, getAllPosts, getPostOfUser, updatePost, deletePost, getPostById } from './controller/index.js';
const postRouter = express.Router();
import upload from '../../middleware/upload.js';

postRouter.post("/", upload.single("image"), createPost);
postRouter.get("/", getAllPosts);
postRouter.get("/:userId", getPostOfUser);
postRouter.patch("/:id", updatePost);
postRouter.delete("/:id", deletePost);
postRouter.get("/post/:id", getPostById);

export default postRouter;