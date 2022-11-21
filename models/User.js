const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        password: { type: String, required: true },
        avatar: {
            type: String,
            default:
                "https://firebasestorage.googleapis.com/v0/b/av-store-364309.appspot.com/o/unknow.jpg?alt=media&token=1bc8e321-b02c-4fd2-acf5-f1aa6e26e0d5",
        },
        birthday: { type: String },
        gender: { type: Number, default: 0 }, // 0: nữ, 1: nam
        verified: { type: Boolean, default: false },
        blocked: { type: Boolean, default: false },
        address: { type: Object, default: {} },
        roleId: { type: Number, default: 0, ref: "Role" },
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

module.exports = mongoose.model("User", UserSchema);
