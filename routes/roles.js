const router = require("express").Router();
const RoleController = require("../controllers/RoleController");
const { verifyToken } = require("../utils/verify");

// UPDATE ROLE
router.post("/", RoleController.create);

module.exports = router;
