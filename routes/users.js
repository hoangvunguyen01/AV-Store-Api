const router = require("express").Router();
const UserController = require("../controllers/UserController");
const { verifyTokenAndAuth, verifyTokenAdmin } = require("../utils/verify");
const { body } = require("express-validator");
const { errorsValidation } = require("../utils/middlewares");

// UPDATE
router.put(
    "/:id",
    verifyTokenAndAuth,
    body("name").notEmpty().withMessage("Vui lòng nhập tên của bạn."),
    body("phone").notEmpty().withMessage("Vui lòng nhập SĐT của bạn."),
    body("birthday").notEmpty().withMessage("Vui lòng nhập ngày sinh của bạn."),
    body("gender").notEmpty().withMessage("Vui lòng chọn giới tính của của bạn."),
    body("province").notEmpty().withMessage("Vui lòng chọn tỉnh/thành."),
    body("district").notEmpty().withMessage("Vui lòng chọn quận/huyện."),
    body("ward").notEmpty().withMessage("Vui lòng chọn phường/xã."),
    errorsValidation,
    UserController.updateInfo
);

router.put(
    "/password/:id",
    verifyTokenAndAuth,
    body("password").notEmpty().withMessage("Vui lòng nhập mật khẩu cũ."),
    body("newPassword")
        .notEmpty()
        .withMessage("Vui lòng nhập mật khẩu mới.")
        .isLength({ min: 6 })
        .withMessage("Vui lòng nhập mật khẩu ít nhất 6 ký tự"),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Vui lòng nhập xác thực mật khẩu.")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) throw new Error("Vui lòng nhập xác thực mật khẩu giống với mật khẩu.");
            return true;
        }),
    errorsValidation,
    UserController.changePassword
);

// BLOCK / UNBLOCK
router.put(
    "/block-unblock/:id",
    verifyTokenAdmin,
    body("blocked").notEmpty().withMessage("Vui lòng nhập id người dùng."),
    errorsValidation,
    UserController.blockAndUnblock
);
// GET MAX PAGE
router.get("/page", UserController.getMaxPage);

// GET BY ID
router.get("/:id", UserController.getUserById);

// GET ALL
router.get("/", UserController.getAll);

module.exports = router;
