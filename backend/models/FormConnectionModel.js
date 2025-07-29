import mongoose from "mongoose";

const formConnectionSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    part: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part",
        required: true
    }],
});

const FormConnectionModel = new mongoose.model("FormConnection", formConnectionSchema);

export default FormConnectionModel;