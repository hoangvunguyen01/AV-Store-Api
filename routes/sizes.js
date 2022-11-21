const router = require("express").Router();
const SizeController = require("../controllers/SizeController");
const { body, validationResult } = require("express-validator");
const { verifyTokenAndAdmin } = require("../utils/verify");
const { formatResponse } = require("../utils/response");

// UPDATE
router.put(
    "/:id",
    verifyTokenAndAdmin,
    body("name").notEmpty().withMessage("Vui lòng nhập tên sản phẩm."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(formatResponse(1, errors.array()[0].msg));
        }
        next();
    },

    SizeController.update
);

// DELETE
router.delete("/:id", verifyTokenAndAdmin, SizeController.delete);

// CREATE
router.post(
    "/",
    verifyTokenAndAdmin,
    body("name").notEmpty().withMessage("Vui lòng nhập tên sản phẩm."),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json(formatResponse(1, errors.array()[0].msg));
        }
        next();
    },
    SizeController.create
);

// GET
router.get("/:id", SizeController.getSizeById);

// GET ALL
router.get("/", SizeController.getAll);

module.exports = router;
