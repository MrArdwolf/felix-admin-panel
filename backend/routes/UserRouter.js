import { Router } from "express";
import UserController from "../controllers/UserController.js";

const UserRouter = Router();

UserRouter.post("/auth/register", UserController.registerUser);

UserRouter.post("/auth/login", UserController.loginUser);

UserRouter.get("/auth/authenticate", UserController.Authenticate);

export default UserRouter;