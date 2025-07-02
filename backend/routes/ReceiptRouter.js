import { Router } from "express";
import ReceiptController from "../controllers/ReceiptController.js";

const ReceiptRouter = Router();

ReceiptRouter.get("/get/:id", ReceiptController.getReceiptByCustomerId);

export default ReceiptRouter;