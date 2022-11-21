const express = require("express");
const app = express();
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/orders");
const roleRoute = require("./routes/roles");
const sizeRoute = require("./routes/sizes");
const colorRoute = require("./routes/colors");
const categoryRoute = require("./routes/category");
const warehouseRoute = require("./routes/warehouse");
const db = require("./config/db");
const passportSetup = require("./config/passport");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    session({
        secret: "avstoresecret",
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 5000 },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to Database
db.connect();

app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use("/orders", orderRoute);
app.use("/roles", roleRoute);
app.use("/colors", colorRoute);
app.use("/sizes", sizeRoute);
app.use("/categories", categoryRoute);
app.use("/warehouse", warehouseRoute);

app.listen("5000", () => {
    console.log("Backend is running.");
});
