const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config();
const Cart = require("../models/Cart");
const User = require("../models/User");
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
            scope: ["profile", "email"],
        },
        async function (accessToken, refreshToken, profile, cb) {
            let user = await User.findOne({ email: profile._json.email }).populate("roleId", "permission -_id");
            if (user) {
                return cb(null, user);
            } else {
                const { name, email, picture, email_verified } = profile._json;
                const newUser = new User({
                    name,
                    email,
                    avatar: picture,
                    verified: email_verified,
                    password: email,
                });

                const cart = new Cart({ userId: newUser._id });

                User.create(newUser)
                    .then(() => {
                        Cart.create(cart)
                            .then(() => cb(null, newUser))
                            .catch(() => cb(null, false));
                    })
                    .catch((error) => {
                        console.log(error);
                        return cb(null, false);
                    });
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
