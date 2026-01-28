import ArchivedModel from "../models/ArchivedModel.js";
import receiptModel from "../models/ReceiptModel.js";
import PartModel from "../models/PartModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";



async function addArchived(req, res) {
    try {
        const archived = req.body;

        const { name, email, phone, bikeDescription, partToFix, alsoDo, comments, parts, partPrices, mechanicComments, customerConnection } = archived;
        if (!archived) {
            res.statusCode = 400;
            throw new Error("Missing data")
        }
        console.log(name)

        console.log(req.body);
        
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

        const allParts = await PartModel.find();

        console.log(parts);

        const markedParts = parts.map((part1) => {
            const foundPart = allParts.find((part2) => part2._id.toString() === part1._id.toString());
            return {
                _id: part1._id,
                name: foundPart ? foundPart.name : "Unknown",
                price: foundPart ? foundPart.price : 0,
                quantity: part1.quantity,
            };
        });

        console.log(partPrices);
        const receiptParts = markedParts.map((part) => {
            partPrices.forEach(element => {
                if (element.id === part._id) {
                    part.price = element.price;
                }
            });
            return {
                _id: part._id,
                name: part.name,
                price: part.price,
                quantity: part.quantity,
            };
        });

        delete archived._id;

        // now create the Archived;
        const newArchived = await ArchivedModel.create(
            archived
        );
        
        const receipt = await receiptModel.create({
            name,
            email,
            phone,
            bikeDescription,
            parts: receiptParts,
            customer: newArchived._id,
        });

        // Send the Archived as response;
        res.status(200).json({
            status: 201,
            success: true,
            message: "Archived created Successfully",
            archived: newArchived,
            receipt: receipt,
        });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
        console.log(error);
    }
}

async function getAllArchived(req, res) {
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
        
        const archived = await ArchivedModel.find();
        res.json(archived);
    } catch(error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function deleteArchived(req, res) {
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

        const archived = await ArchivedModel.findById(req.params.id);
        if (!archived) {
            res.statusCode = 404;
            throw new Error("Archived not found");
        }

        await ArchivedModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Archived has been deleted" });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}





export default {
    addArchived,
    getAllArchived,
    deleteArchived,
}