const router = require("express").Router();
const CategoryController = require("../controllers/CategoryController");
const { body } = require("express-validator");
const { verifyTokenAdmin } = require("../utils/verify");
const { errorsValidation } = require("../utils/middlewares");

// UPDATE
router.put(
    "/:id",
    verifyTokenAdmin,
    body("name").notEmpty().withMessage("Vui lòng nhập danh mục sản phẩm."),
    body("sizes").isLength({ min: 1 }).withMessage("Vui lòng chọn kích thước."),
    body("imgLarge").notEmpty().withMessage("Vui lòng chọn ảnh lớn mới."),
    body("imgSmall").notEmpty().withMessage("Vui lòng chọn ảnh nhỏ mới."),
    errorsValidation,
    CategoryController.update
);

// DELETE
router.delete("/:id", verifyTokenAdmin, CategoryController.delete);

// CREATE
router.post(
    "/",
    verifyTokenAdmin,
    body("name").notEmpty().withMessage("Vui lòng nhập tên danh mục sản phẩm."),
    body("sizes").isLength({ min: 1 }).withMessage("Vui lòng chọn kích thước."),
    body("imgLarge").notEmpty().withMessage("Vui lòng chọn ảnh lớn mới."),
    body("imgSmall").notEmpty().withMessage("Vui lòng chọn ảnh nhỏ mới."),
    errorsValidation,
    CategoryController.create
);

// GET
router.get("/:slug", CategoryController.getCategoryBySlug);

// GET ALL
router.get("/", CategoryController.getAll);

module.exports = router;
