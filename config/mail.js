// Email handler
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();
const myOAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

myOAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
});

const myAccessTokenObject = async () => await myOAuth2Client.getAccessToken();

const myAccessToken = myAccessTokenObject.token;

// Nodemailer stuff
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "avstorehcm@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: myAccessToken,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log("Can not connect to gmail");
    } else {
        console.log("Ready for send email");
    }
});

module.exports = transporter;
