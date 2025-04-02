import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: String,
    lastName: String,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    }
},
{ timestamps: true }
);

const UserModel = new mongoose.model("User", userSchema);

export default UserModel;