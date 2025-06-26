import CustomerModel from "../models/CustomerModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import nodemailer from "nodemailer";

import { customerEmail } from "../emails/email.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

let bikeNumbers = []

function generateBikeNr() {
    let nr = 1;
    while(bikeNumbers.length < 50) {
        bikeNumbers.push(nr);
        nr++;
    }
}

generateBikeNr()

async function removeBikeNumber() {
    try {
        const customer = await CustomerModel.find();
        if (customer) {
            customer.forEach((customer) => {
                bikeNumbers = bikeNumbers.filter((bikeNumber) => bikeNumber !== customer.bikeNumber);
            })
        }
    } catch (error) {
        console.log(error);
    }
}

removeBikeNumber();

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
            bikeNumber: bikeNumbers.shift(),
        });

        const info = await transporter.sendMail({
            from: `"Felix Cykelmeck" <${process.env.EMAIL_USER}>`,
            to: newCustomer.email,
            subject: "Inlämning av cykel",
            html: customerEmail(newCustomer ),
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

        const customer = await CustomerModel.find();
        res.json(customer);
    } catch (error) {
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

        const updatedCustomer = await CustomerModel.findByIdAndUpdate(req.params.id, { parts: body.parts, partPrices: body.partPrices }, { new: true });
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

        bikeNumbers.push(customer.bikeNumber);
        console.log(bikeNumbers);

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