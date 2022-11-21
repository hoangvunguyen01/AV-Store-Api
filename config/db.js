const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connect database successfully!");
    } catch (err) {
        console.log("Connect database failure!");
    }
}

module.exports = { connect };
