import mongoose from "mongoose";

const masterSchema = new mongoose.Schema({
    master: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
},
{ timestamps: true }
);

const MasterModel = new mongoose.model("Master", masterSchema);

export default MasterModel;