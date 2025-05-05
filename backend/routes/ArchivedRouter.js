import { Router } from "express";
import ArchivedController from "../controllers/ArchivedController.js";

const ArchivedRouter = Router();

ArchivedRouter.post("/add", ArchivedController.addArchived);

ArchivedRouter.get("/get", ArchivedController.getAllArchived);

ArchivedRouter.delete("/:id", ArchivedController.deleteArchived);

export default ArchivedRouter;