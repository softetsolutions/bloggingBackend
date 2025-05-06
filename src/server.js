import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import entityManager from './models/entityManager.js';
import APIrouter from './API-gateway.js';

dotenv.config();

const app = express();
app.use(express.json());
// Routes
app.use("/", APIrouter);
const PORT = process.env.PORT || 5005;

const startServer = async () => {
    await connectDB();
    new entityManager();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();