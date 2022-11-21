const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        products: [
            {
                sampleId: { type: Number, ref: "Warehouse" },
                quantity: { type: Number, default: 1 },
                size: { type: String },
            },
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        note: { type: String },
        payment: { type: String },
        status: { type: String, default: "wait-confirm" },
        reason: { type: String },
        order_code: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
