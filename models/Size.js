const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

const SizeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true }
);

SizeSchema.plugin(autoIncrement.plugin, "Size");

module.exports = mongoose.model("Size", SizeSchema);
