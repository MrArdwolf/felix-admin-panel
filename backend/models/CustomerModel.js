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
        part: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Part"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    partPrices: [{

    }],
    bikeNumber: {
        type: Number,
        required: true
    },
    priceAccepted: {
        type: Boolean,
        default: false
    },
    priceSent: {
        type: Boolean,
        default: false
    },
    bikeDone: {
        type: Boolean,
        default: false
    },
    mechanicComments: {
        type: String
    },
    customerConnection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    }]
});

const CustomerModel = new mongoose.model("Customer", customerSchema);

export default CustomerModel;