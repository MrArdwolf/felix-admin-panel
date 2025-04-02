import MasterModel from "../models/MasterModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();



async function registerMaster(req, res) {
    try {
        const master = req.body;

        const { masterPassword } = master;
        if (!masterPassword) {
            res.statusCode = 400;
            throw new Error("Missing data")
        }

        const isMasterExist = await MasterModel.findOne({
            master: "master",
        });

        if (isMasterExist) {
            res.statusCode = 400;
            throw new Error("Master already defined")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(masterPassword, salt);

        // now create the master;
        const newMaster = await MasterModel.create({
            master: "master",
            password: hashedPassword,
        });

        // Send the newMaster as  response;
        res.status(200).json({
            status: 201,
            success: true,
            message: "Master created Successfully",
            master: newMaster,
        });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error });
    }
}

export default {
    registerMaster,
}