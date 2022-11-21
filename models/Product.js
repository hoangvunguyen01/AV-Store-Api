const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        desc: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        weight: { type: Number, required: true },
        image: { type: String, required: true },
        sizes: { type: Array, required: true },
        categoryId: { type: Number, ref: "Category" },
    },
    { timestamps: true }
);
ProductSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Product", ProductSchema);
