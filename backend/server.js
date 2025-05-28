import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import UserRouter from './routes/UserRouter.js';
import MasterRouter from './routes/MasterRouter.js';
import PartRouter from './routes/PartRouter.js';
import CustomerRouter from './routes/CustomerRouter.js';
import ArchivedRouter from './routes/ArchivedRouter.js';


dotenv.config();

const server = express()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const corsOptions = {
    origin: FRONTEND_URL, // Replace with your frontend's origin
    credentials: true, // Allow cookies to be sent with requests
    allowedHeaders: ['Content-Type', 'Authorization'],
};

server.use(cors(corsOptions));

server.use(express.json());
server.use(requestLogger);

server.use(cookieParser());

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DATABASE } = process.env;
if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DATABASE) {
    console.log("Missing environment variables");
    process.exit(1);
}

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(uri)
    .then(() => console.log("Connected to database"))
    .catch(error => console.error("Could not connect to database", error));


function requestLogger(req, res, next) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
}

server.use("/api/user", UserRouter);
server.use("/api/master", MasterRouter);
server.use("/api/customer", CustomerRouter);
server.use("/api/archived", ArchivedRouter);
server.use("/api/part", PartRouter);

server.all("*", (req, res) => {
    res.statusCode = 404;
    res.json({ message: "Route not found" });
})

const PORT = 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));