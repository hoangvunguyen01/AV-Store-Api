const { validationResult } = require("express-validator");
const { formatResponse } = require("./response");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ storage: storage });

const errorsValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(formatResponse(1, errors.array()[0].msg));
    }
    next();
};

module.exports = {
    upload,
    errorsValidation,
};
