import { Router } from "express";
import PartController from "../controllers/PartController.js";

const PartRouter = Router();

PartRouter.post("/add", PartController.addPart);

PartRouter.get("/get", PartController.getParts);

PartRouter.get("/get/:id", PartController.getPartsByParent);

PartRouter.patch("/:id", PartController.updatePart);

PartRouter.delete("/:id", PartController.deletePart);

export default PartRouter;