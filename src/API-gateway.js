import express from 'express';
import verifyToken from './middleware/verifyAuth.js';
import postRouter from './routes/post/index.js';
import userRouter from './routes/user/index.js';
import commentRouter from './routes/comments/index.js';

const APIrouter = express.Router();
APIrouter.use('/posts', verifyToken, postRouter);
APIrouter.use('/user',  userRouter);
APIrouter.use('/comments', verifyToken, commentRouter);

export default APIrouter;