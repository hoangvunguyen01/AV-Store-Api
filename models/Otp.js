const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Otp = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    time: { type: Date, default: Date.now, index: { expires: 300 } },
});

module.exports = mongoose.model("Otp", Otp);
