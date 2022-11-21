const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        products: [
            {
                sampleId: { type: Number, ref: "Store" },
                quantity: { type: Number, default: 1 },
                size: { type: String },
                price: { type: Number },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
