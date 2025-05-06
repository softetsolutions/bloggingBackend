import express from 'express';
import { createPost, getAllPosts, getPostOfUser, updatePost, deletePost } from './controller/index.js';
const postRouter = express.Router();

postRouter.post("/", createPost);
postRouter.get("/", getAllPosts);
postRouter.get("/:userId", getPostOfUser);
postRouter.patch("/:id", updatePost);
postRouter.delete("/:id", deletePost);

export default postRouter;