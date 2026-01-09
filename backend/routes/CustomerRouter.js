import { Router } from "express";
import CustomerController from "../controllers/CustomerController.js";

const CustomerRouter = Router();

CustomerRouter.post("/add", CustomerController.addCustomer);

CustomerRouter.get("/get", CustomerController.getCustomers);

CustomerRouter.patch("/:id", CustomerController.updateCustomer);

CustomerRouter.delete("/:id", CustomerController.deleteCustomer);

CustomerRouter.post("/recreate", CustomerController.recreateCustomer);

export default CustomerRouter;