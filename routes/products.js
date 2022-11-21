const router = require("express").Router();
const ProductController = require("../controllers/ProductController");
const { body } = require("express-validator");
const { verifyTokenAdmin } = require("../utils/verify");
const { errorsValidation } = require("../utils/middlewares");

// UPDATE
router.put(
    "/:id",
    verifyTokenAdmin,
    body("name").notEmpty().withMessage("Vui lòng nhập tên sản phẩm."),
    body("desc").notEmpty().withMessage("Vui lòng nhập mô tả sản phẩm."),
    body("price").notEmpty().withMessage("Vui lòng nhập giá bán."),
    body("weight").notEmpty().withMessage("Vui lòng nhập khối lượng sản phẩm."),
    body("sizes").isLength({ min: 1 }).withMessage("Vui lòng chọn kích thước sản phẩm."),
    errorsValidation,
    ProductController.update
);

// DELETE
router.delete("/:id", verifyTokenAdmin, ProductController.delete);

// CREATE
router.post(
    "/",
    verifyTokenAdmin,
    body("name").notEmpty().withMessage("Vui lòng nhập tên sản phẩm."),
    body("desc").notEmpty().withMessage("Vui lòng nhập mô tả sản phẩm."),
    body("price").notEmpty().withMessage("Vui lòng nhập giá bán."),
    body("weight").notEmpty().withMessage("Vui lòng nhập khối lượng."),
    body("categoryId").notEmpty().withMessage("Vui lòng chọn loại sản phẩm."),
    body("colors").isLength({ min: 1 }).withMessage("Vui lòng chọn màu sản phẩm."),
    body("sizes").isLength({ min: 1 }).withMessage("Vui lòng chọn kích thước sản phẩm."),
    body("images").isLength({ min: 1 }).withMessage("Vui lòng chọn hình cho mẫu sản phẩm."),
    errorsValidation,
    ProductController.create
);

// GET MAX PAGE
router.get("/page", ProductController.getMaxPage);

// GET
router.get("/:id", ProductController.getProductById);

// GET ALL
router.get("/", ProductController.getAll);

module.exports = router;
