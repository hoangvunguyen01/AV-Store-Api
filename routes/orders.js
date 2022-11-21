const router = require("express").Router();
const OrderController = require("../controllers/OrderController");
const { verifyToken, verifyTokenOrder, verifyTokenAdmin } = require("../utils/verify");
const { errorsValidation } = require("../utils/middlewares");
const { body } = require("express-validator");

// UPDATE
router.put(
    "/:id",
    verifyTokenAdmin,
    body("status").notEmpty().withMessage("Vui lòng chọn tình trạng đơn hàng."),
    errorsValidation,
    OrderController.update
);

// CANCEL ORDER
router.put(
    "/cancel/:id",
    verifyTokenAdmin,
    body("status").notEmpty().withMessage("Vui lòng chọn tình trạng đơn hàng."),
    body("reason").notEmpty().withMessage("Vui lòng nhập lý do hủy đơn hàng."),
    errorsValidation,
    OrderController.cancel
);

// CREATE SHIPPING ORDER
router.post(
    "/ship/:id",
    // verifyTokenAdmin,
    body("length").notEmpty().withMessage("Vui lòng nhập chiều dài hộp đựng."),
    body("width").notEmpty().withMessage("Vui lòng nhập chiều ngang hộp đựng."),
    body("height").notEmpty().withMessage("Vui lòng nhập chiều cao hộp đựng."),
    errorsValidation,
    OrderController.createShipOrder
);

// CREATE
router.post(
    "/",
    verifyTokenOrder,
    body("address").notEmpty().withMessage("Vui lòng nhập địa chỉ giao hàng."),
    body("payment").notEmpty().withMessage("Vui lòng chọn hình thức thanh toán."),
    errorsValidation,
    OrderController.create
);

// GET MAX PAGE
router.get("/page", OrderController.getMaxPage);

// GET USER ORDERS
router.get("/find/:userId", OrderController.getOrdersByUserId);

// GET
router.get("/:id", OrderController.getOrderById);

// GET ALL
router.get("/", OrderController.getAll);

module.exports = router;
