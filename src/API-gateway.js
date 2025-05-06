import express from 'express';
import authRouter from './routes/userAuth/index.js';
import verifyToken from './middleware/verifyAuth.js';
import postRouter from './routes/post/index.js';

const APIrouter = express.Router();
APIrouter.use('/auth', authRouter);
APIrouter.use('/posts', postRouter);

export default APIrouter;