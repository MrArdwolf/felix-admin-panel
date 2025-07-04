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

        const { email, username, password, masterPassword } = user;
        if (!email || !username || !password || !masterPassword) {
            res.statusCode = 400;
            throw new Error("Missing data")
        }

        const fixedEmail = email.replaceAll(" ", "");

        const fixedUsername = username.replaceAll(" ", "");

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

        const isUsernameAllReadyExist = await UserModel.findOne({
            username: fixedUsername,
        });

        if (isUsernameAllReadyExist) {
            res.statusCode = 400;
            throw new Error("username all ready in use")
        }

        const isEmailAllReadyExist = await UserModel.findOne({
            email: fixedEmail,
        });

        if (isEmailAllReadyExist) {
            res.statusCode = 400;
            throw new Error("Email all ready in use")
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);



        // now create the user;
        const newUser = await UserModel.create({
            email: fixedEmail,
            username: fixedUsername,
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
        const { username, password } = user;

        if (!username || !password) {
            res.statusCode = 400;
            throw new Error("Missing data")
        }

        const fixedUsername = username.replaceAll(" ", "");

        // ** Check the (username/user) exist  in database or not ;
        const isUserExist = await UserModel.findOne({
            username: fixedUsername,
        });

        // ** if there is not any user we will send user not found;
        if (!isUserExist) {
            res.statusCode = 404;
            throw new Error("User not found")
        }

        let token, refreshToken;

        if (await bcrypt.compare(password, isUserExist.password)) {
            token = jwt.sign({ id: isUserExist._id, email: isUserExist.email, username: isUserExist.username, role: isUserExist.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            refreshToken = jwt.sign({ id: isUserExist._id, email: isUserExist.email, username: isUserExist.username, role: isUserExist.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
        } else {
            res.statusCode = 400;
            throw new Error("Password incorrect")
        }

        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 3600000,
            // secure: true,
            // sameSite: "strict",
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: Math.floor(Date.now() + 30 * 24 * 60 * 60 * 1000),
            // secure: true,
            // sameSite: "strict",
        });

        // send the response
        res.status(200).json({
            status: 200,
            success: true,
            message: "login success",
            user: isUserExist,
            token: token,
        });

    } catch (error) {
        res.json({ message: "There was an error", error: error.message });
    }
}

async function Authenticate(req, res) {
    try {
        console.log(req.cookies.authToken);
        const oldToken = req.cookies.refreshToken;
        if (!oldToken) {
            res.statusCode = 401;
            throw new Error("No token found");
        }

        jwt.verify(oldToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.statusCode = 401;
                throw new Error("invalid token");
            }

            const token = jwt.sign({ id: decoded._id, email: decoded.email, username: decoded.username, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            const refreshToken = jwt.sign({ id: decoded._id, email: decoded.email, username: decoded.username, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "30d" });


            res.cookie("authToken", token, {
                httpOnly: true,
                maxAge: 3600000,
                // secure: true,
                // sameSite: "strict",
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: Math.floor(Date.now() + 30 * 24 * 60 * 60 * 1000),
                // secure: true,
                // sameSite: "strict",
            });


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

async function logoutUser(req, res) {
    try {
        res.clearCookie("authToken");
        res.clearCookie("refreshToken");
        res.status(200).json({
            status: 200,
            success: true,
            message: "logout success",
        });
    } catch (error) {
        res.json({ message: "There was an error", error: error.message });
    }
}



export default {
    registerUser,
    loginUser,
    Authenticate,
    logoutUser,
}