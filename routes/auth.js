const router = require("express").Router();
const { body } = require("express-validator");
const UserController = require("../controllers/UserController");
const { errorsValidation } = require("../utils/middlewares");
const passport = require("passport");

// REGISTER
router.post(
    "/register",
    body("name").notEmpty().withMessage("Vui lòng nhập tên của bạn."),
    body("email")
        .notEmpty()
        .withMessage("Vui lòng nhập email của bạn.")
        .isEmail()
        .withMessage("Vui lòng nhập đúng email hợp lệ."),
    body("phone").notEmpty().withMessage("Vui lòng nhập SĐT của bạn."),
    body("password")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu.")
        .isLength({ min: 6 })
        .withMessage("Vui lòng nhập mật khẩu ít nhất 6 ký tự"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Vui lòng nhập xác thực mật khẩu.")
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error("Vui lòng nhập xác thực mật khẩu giống với mật khẩu.");
            return true;
        }),
    errorsValidation,
    UserController.register
);

// VERIFY
router.get("/verify/:token", UserController.verify);

// RESEND VERIFY
router.post(
    "/resend-verify",
    body("email")
        .notEmpty()
        .withMessage("Vui lòng nhập email của bạn.")
        .isEmail()
        .withMessage("Vui lòng nhập đúng email hợp lệ."),
    errorsValidation,
    UserController.resendLinkVerify
);

// SEND OTP
router.post(
    "/otp",
    body("email")
        .notEmpty()
        .withMessage("Vui lòng nhập email của bạn.")
        .isEmail()
        .withMessage("Vui lòng nhập đúng email hợp lệ."),
    errorsValidation,
    UserController.sendOtp
);

// FORGOT PASSOWRD
router.post(
    "/forgot-password",
    body("email")
        .notEmpty()
        .withMessage("Vui lòng nhập email của bạn.")
        .isEmail()
        .withMessage("Vui lòng nhập đúng email hợp lệ."),
    body("otp").notEmpty().withMessage("Vui lòng nhập mã otp."),
    body("password")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu mới.")
        .isLength({ min: 6 })
        .withMessage("Vui lòng nhập mật khẩu ít nhất 6 ký tự"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Vui lòng nhập xác thực mật khẩu.")
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error("Vui lòng nhập xác thực mật khẩu giống với mật khẩu.");
            return true;
        }),
    errorsValidation,
    UserController.changePasswordWithOTP
);

// LOGIN
router.post(
    "/login",
    body("email")
        .notEmpty()
        .withMessage("Vui lòng nhập email của bạn.")
        .isEmail()
        .withMessage("Vui lòng nhập đúng email hợp lệ."),
    body("password")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu.")
        .isLength({ min: 6 })
        .withMessage("Vui lòng nhập mật khẩu ít nhất 6 ký tự"),
    errorsValidation,
    UserController.login
);

// LOGIN SUCCESS
router.get("/login/google", UserController.loginGoogle);

// LOGIN FAILED
router.get("/login/failed", UserController.loginFailed);

// LOGIN GOOGLE CALLBACK
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "http://localhost:3000/login",
        failureRedirect: "http://localhost:3000/login",
    })
);

// LOGIN GOOGLE
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

module.exports = router;
