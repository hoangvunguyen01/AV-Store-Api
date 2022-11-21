const Role = require("../models/Role");
const { formatResponse } = require("../utils/response");

class RoleController {
    // UPDATE
    update(req, res) {
        Role.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, `${req.body.status} thành công`)))
            .catch(() => res.json(formatResponse(4, `${req.body.status} thất bại`)));
    }

    // CREATE
    create(req, res) {
        const role = new Role(req.body);
        role.save()
            .then(() => res.json(formatResponse(0, "Tạo role thành công")))
            .catch(() => res.json(formatResponse(4, "Tạo role thất bại")));
    }

    // GET BY ID
    async getRoleById(req, res) {
        try {
            const Roles = await Role.find({ _id: req.params.id });
            res.json(Roles);
        } catch (err) {
            res.json(formatResponse(4, "Lấy dữ liệu thất bại!"));
        }
    }
}

module.exports = new RoleController();
