import express from "express";
import { createUser, login, logout } from "./controller/index.js";
const authRouter = express.Router();

authRouter.post("/register", createUser);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;