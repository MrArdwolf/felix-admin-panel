import mongoose from "mongoose";

const partSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part"
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part"
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    changedLastBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    formConnections: [{
        type: Object
    }]
});

const PartModel = new mongoose.model("Part", partSchema);

export default PartModel;