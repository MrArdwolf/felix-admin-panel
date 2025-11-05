import mongoose from "mongoose";

const archivedSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    bikeDescription: {
        type: String,
        required: true
    },
    partToFix: [{
        type: String
    }],
    alsoDo: [{
        type: String
    }],
    comments: {
        type: String
    },
    parts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part"
    }],
    partPrices: [{
        
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    mechanicComments: {
        type: String
    },
        customerConnection: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        }]
});

const ArchivedModel = new mongoose.model("Archived", archivedSchema);

export default ArchivedModel;