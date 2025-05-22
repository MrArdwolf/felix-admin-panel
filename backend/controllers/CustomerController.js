import CustomerModel from "../models/CustomerModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import nodemailer from "nodemailer";

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

let bikeNumbers = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
]

async function removeBikeNumber() {
    try {
        const customer = await CustomerModel.find();
        if (customer) {
            customer.forEach((customer) => {
                bikeNumbers = bikeNumbers.filter((bikeNumber) => bikeNumber !== customer.bikeNumber);
            })
            console.log(bikeNumbers);
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
            html: 
                `<body style="width: 90%; font-family: Arial, Helvetica, sans-serif; color: #2F2E2E; ">
                    <h2>Hejsan ${newCustomer.name},</h2>
                    <p style="font-size: 17px;">Tack för att du anförtror din cykel ${newCustomer.bikeNumber} till oss.</p>
                    <p style="font-size: 17px;">Vi hör av oss så fort vi kan med ett prisförslag.</p>
                    <br>
                    <div style="text-align: left; margin: 0; padding: 0; width: 100%;">
                        <p style="font-size: 17px; margin: 0; padding: 0;">Mvh,</p>
                        <p style="font-size: 17px; margin: 0; padding: 0;">Felix Cykelmeck</p>
                    </div>
                </body>`, // HTML body
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