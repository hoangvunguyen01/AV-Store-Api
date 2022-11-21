const { validationResult } = require("express-validator");
const { formatResponse } = require("./response");

const errorsValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(formatResponse(1, errors.array()[0].msg));
    }
    next();
};

module.exports = {
    errorsValidation,
};
