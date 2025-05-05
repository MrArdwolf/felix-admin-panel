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
    partToFix: {
        type: [{}]
    },
    alsoDo: {
        type: [{}]
    },
    comments: {
        type: String
    },
    parts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ArchivedModel = new mongoose.model("Archived", archivedSchema);

export default ArchivedModel;