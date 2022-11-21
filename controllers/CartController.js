const Cart = require("../models/Cart");
const { formatResponse } = require("../utils/response");

class CartController {
    // UPDATE CART
    update(req, res) {
        Cart.findOneAndUpdate({ userId: req.user.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, "Thành công")))
            .catch(() => res.json(formatResponse(1, "Thất bại")));
    }
}

module.exports = new CartController();
