import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
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