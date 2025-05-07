import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import entityManager from './models/entityManager.js';
import APIrouter from './API-gateway.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
dotenv.config();

const app = express();
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// Routes
app.use("/", APIrouter);
const PORT = process.env.PORT || 5005;

const startServer = async () => {
    await connectDB();
    new entityManager();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();