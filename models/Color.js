const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const ColorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        hex: { type: String, required: true },
    },
    { timestamps: true }
);

ColorSchema.plugin(autoIncrement.plugin, "Color");
ColorSchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Color", ColorSchema);
