import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
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
    }]
});

const CustomerModel = new mongoose.model("Customer", customerSchema);

export default CustomerModel;