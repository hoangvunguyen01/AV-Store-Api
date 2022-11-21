const router = require("express").Router();
const CartController = require("../controllers/CartController");
const { verifyTokenCart } = require("../utils/verify");

// UPDATE CART
router.put("/", verifyTokenCart, CartController.update);

module.exports = router;
