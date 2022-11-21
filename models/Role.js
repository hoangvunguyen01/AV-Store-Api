const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose);

// UPDATE CART = 1
// CRUD ORDER = 2
// ADMIN = 4

const RoleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        permission: { type: Number, default: 0 },
    },
    { timestamps: true }
);

RoleSchema.plugin(autoIncrement.plugin, "Role");

module.exports = mongoose.model("Role", RoleSchema);
