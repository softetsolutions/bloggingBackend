import express from 'express';
import authRouter from './routes/userAuth/index.js';
import verifyToken from './middleware/verifyAuth.js';

const APIrouter = express.Router();
APIrouter.use('/auth', authRouter);

export default APIrouter;