import CustomerModel from "../models/CustomerModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



async function addCustomer(req, res) {
    try {
        const customer = req.body;

        const { name, email, phone, bikeDescription, partToFix, alsoDo, comments } = customer;
        if (!name || !email || !phone || !bikeDescription) {
            res.statusCode = 400;
            throw new Error("Missing data")
        }

        // now create the Customer;
        const newCustomer = await CustomerModel.create({
            name,
            email,
            phone,
            bikeDescription,
            partToFix,
            alsoDo,
            comments,
        });

        // Send the newCustomer as response;
        res.status(200).json({
            status: 201,
            success: true,
            message: "Customer created Successfully",
            customer: newCustomer,
        });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function getCustomers(req, res) {
    try {
        const userToken = req.cookies.authToken;
        let user = null;
        if (!userToken) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded.id;
        });

        const customer = await CustomerModel.find().populate("parts");
        res.json(customer);
    } catch(error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function updateCustomer(req, res) {
    try {
        const customer = await CustomerModel.findById(req.params.id);
        if (!customer) {
            res.statusCode = 404;
            throw new Error("Customer not found");
        }
        
        const userToken = req.cookies.authToken;
        let user = null;
        if (!userToken) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded.id;
        });

        const body = req.body;
        if (!body.parts) {
            res.statusCode = 400;
            throw new Error("No data to update Customer");
        }

        const updatedCustomer = await CustomerModel.findByIdAndUpdate(req.params.id, { parts: body.parts }, { new: true });
        res.json({ message: "Customer has been updated", data: updatedCustomer });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function deleteCustomer(req, res) {
    try {
        
        const userToken = req.cookies.authToken;
        let user = null;
        if (!userToken) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded.id;
        });

        const customer = await CustomerModel.findById(req.params.id);
        if (!customer) {
            res.statusCode = 404;
            throw new Error("Customer not found");
        }

        await CustomerModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Customer has been deleted" });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}





export default {
    addCustomer,
    getCustomers,
    updateCustomer,
    deleteCustomer,
}