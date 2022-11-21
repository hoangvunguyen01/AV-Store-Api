const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const WarehouseSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        colorId: { type: Number, ref: "Color" },
        image: { type: String, required: true },
        quantity: { type: Array, default: [] },
    },
    { timestamps: true }
);

WarehouseSchema.plugin(autoIncrement.plugin, "Warehouse");
WarehouseSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Warehouse", WarehouseSchema);
