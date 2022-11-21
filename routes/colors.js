const router = require("express").Router();
const ColorController = require("../controllers/ColorController");
const { verifyTokenAdmin } = require("../utils/verify");
const { body } = require("express-validator");
const { errorsValidation } = require("../utils/middlewares");

// UPDATE
router.put(
    "/:id",
    verifyTokenAdmin,
    body("name").notEmpty().withMessage("Vui lòng nhập tên màu."),
    body("hex").notEmpty().withMessage("Vui lòng nhập mã màu."),
    errorsValidation,
    ColorController.update
);

// DELETE
router.delete("/:id", verifyTokenAdmin, ColorController.delete);

// CREATE
router.post(
    "/",
    verifyTokenAdmin,
    body("name").notEmpty().withMessage("Vui lòng nhập tên màu."),
    body("hex").notEmpty().withMessage("Vui lòng nhập mã màu."),
    errorsValidation,
    ColorController.create
);

// GET
router.get("/:id", ColorController.getColorById);

// GET ALL
router.get("/", ColorController.getAll);

module.exports = router;
