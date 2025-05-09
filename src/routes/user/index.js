import express from "express";
import { getAllUsers, getUserById, registerUser, login, logout, updateUser, deleteUser } from "./controller/index.js";
const userRouter = express.Router();
import verifyToken  from "../../middleware/verifyAuth.js";

userRouter.post("/register", registerUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/",verifyToken, getAllUsers);
userRouter.get("/:id",verifyToken, getUserById);
userRouter.put("/:id",verifyToken, updateUser);
userRouter.delete("/:id", verifyToken, deleteUser);

export default userRouter;