import express from 'express';
import { createComment, getAllCommentsOfPost, deleteComment, updateComment } from './controller/index.js';
const commentRouter = express.Router();

commentRouter.post("/", createComment);
commentRouter.get("/:postId", getAllCommentsOfPost);
commentRouter.delete("/:postId", deleteComment);
commentRouter.put("/:postId", updateComment);

export default commentRouter;