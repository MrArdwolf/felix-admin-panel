import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    bikeDescription: {
        type: String,
    },
    bikeNumber: {
        type: Number,
    },
    parts: [{
        type: Object,
    }],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },

},
    { timestamps: true }
);

const ReceiptModel = new mongoose.model("Receipt", receiptSchema);

export default ReceiptModel;