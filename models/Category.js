const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const slug = require("mongoose-slug-generator");
const mongoose_delete = require("mongoose-delete");
mongoose.plugin(slug);
autoIncrement.initialize(mongoose);

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        sizes: { type: Array, required: true },
        imgLarge: { type: String, required: true },
        imgSmall: { type: String, required: true },
        slug: { type: String, slug: "name" },
    },
    { timestamps: true }
);

CategorySchema.plugin(autoIncrement.plugin, "Category");
CategorySchema.plugin(mongoose_delete, { overrideMethods: "all" });

module.exports = mongoose.model("Category", CategorySchema);
