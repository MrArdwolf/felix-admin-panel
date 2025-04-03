import UserModel from "../models/UserModel.js";
import MasterModel from "../models/MasterModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();



async function registerUser(req, res) {
    try {
        const user = req.body;
        let masterCorrect = false;

        const { username, email, firstName, lastName, password, masterPassword } = user;
        if (!username || !email || !firstName || !lastName || !password || !masterPassword) {
            res.statusCode = 400;
            throw new Error("Missing data")
        }

        const isMasterExist = await MasterModel.findOne({
            master: "master",
        });

        if (!isMasterExist) {
            res.statusCode = 404;
            throw new Error("Master not defined")
        }

        if (await bcrypt.compare(masterPassword, isMasterExist.password)) {
            masterCorrect = true;
        }

        if (!masterCorrect) {
            res.statusCode = 400;
            throw new Error("Master password incorrect")
        }

        const isEmailAllReadyExist = await UserModel.findOne({
            email: email,
        });

        if (isEmailAllReadyExist) {
            res.statusCode = 400;
            throw new Error("Email all ready in use")
        }

        const isUsernameAllReadyExist = await UserModel.findOne({
            username: username,
        });

        if (isUsernameAllReadyExist) {
            res.statusCode = 400;
            throw new Error("username all ready in use")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        


        // now create the user;
        const newUser = await UserModel.create({
            username,
            email,
            firstName,
            lastName,
            password: hashedPassword,
        });

        // Send the newUser as  response;
        res.status(200).json({
            status: 201,
            success: true,
            message: " User created Successfully",
            user: newUser,
        });
    } catch (error) {
        res.statusCode = 400;
        res.json({ message: "There was an error", error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        // ** Get The User Data From Body ;
        const user = req.body;

        // ** destructure the information from user;
        const { email, password } = user;
        
        if (!email || !password) {
            res.statusCode = 400;
            throw new Error("Missing data")
        }

        // ** Check the (email/user) exist  in database or not ;
        const isUserExist = await UserModel.findOne({
            email: email,
        });

        // ** if there is not any user we will send user not found;
        if (!isUserExist) {
            res.statusCode = 404;
            throw new Error("User not found")
        }

        let token;

        if (await bcrypt.compare(password, isUserExist.password)) {
            token = jwt.sign({ id: isUserExist._id, username: isUserExist.username, role: isUserExist.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        }

        // send the response
        res.status(200).json({
            status: 200,
            success: true,
            message: "login success",
            username: isUserExist.username,
            token: token,
        });

    } catch (error) {
        res.json({ message: "There was an error", error: error.message });
    }
}

async function Authenticate(req, res) {
    try {
        const token = req.header('Authorization');
        if (!token) {
            res.statusCode = 401;
            throw new Error("Unauthorized");
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("Unauthorized");
            }
            res.status(200).json({
                status: 200,
                success: true,
                message: "Authenticated",
                user: decoded,
            });
        });
        }
    catch (error) {
        res.json({ message: "There was an error", error: error.message });
    }
}



export default {
    registerUser,
    loginUser,
    Authenticate,
}