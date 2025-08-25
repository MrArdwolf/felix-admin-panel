import ReceiptModel from "../models/ReceiptModel.js";
import jwt from "jsonwebtoken";

import { receiptEmail } from "../nodemailer/templates.js";
import sendMail from "../nodemailer/sendMail.js";



async function getReceiptByCustomerId(req, res) {
    try {
        const userToken = req.cookies.authToken;
        let user;

        jwt.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized", err);
            }
            user = decoded;
            console.log(decoded);
        });
        
        const receipt = await ReceiptModel.findOne({customer: req.params.id});

        if (!receipt) {
            res.statusCode = 404;
            throw new Error("Receipt not found");
        }

        sendMail({
            from: `"Felix Cykelmeck" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Kvitto för cykel inlämnad av ${receipt.name}, färdig ${receipt.createdAt.toLocaleDateString("sv-SE")}`,
            html: receiptEmail(receipt),
        });

        res.json(receipt);
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}


export default {
    getReceiptByCustomerId,
}