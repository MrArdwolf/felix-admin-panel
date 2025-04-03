import { Router } from "express";
import MasterController from "../controllers/MasterController.js";

const MasterRouter = Router();

MasterRouter.post("/auth/register", MasterController.registerMaster);

export default MasterRouter;