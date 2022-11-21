const router = require("express").Router();
const WarehouseController = require("../controllers/WarehouseController");
const { verifyTokenAdmin } = require("../utils/verify");
const { body } = require("express-validator");
const { errorsValidation } = require("../utils/middlewares");

// UPDATE
router.put(
    "/:id",
    verifyTokenAdmin,
    body("quantity").notEmpty().withMessage("Vui lòng nhập số lượng của mẫu."),
    errorsValidation,
    WarehouseController.update
);

// DELETE
router.delete("/:id", verifyTokenAdmin, WarehouseController.delete);

// GET MAX PAGE
router.get("/page", WarehouseController.getMaxPage);

// GET BY PRODUCTID
router.get("/productId/:id", WarehouseController.getSamplesByProductId);

// GET BY ID
router.get("/:id", WarehouseController.getById);

// GET ALL
router.get("/", WarehouseController.getAll);

module.exports = router;
