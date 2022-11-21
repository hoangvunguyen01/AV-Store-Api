const Color = require("../models/Color");
const { formatResponse } = require("../utils/response");

class ColorController {
    // UPDATE
    update(req, res) {
        Color.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, "Chỉnh sửa thành công", req.body)))
            .catch(() => res.json(formatResponse(4, "Chỉnh sửa thất bại")));
    }

    // DELETE
    delete(req, res) {
        Color.delete({ _id: req.params.id })
            .then(() => res.json(formatResponse(0, "Xóa thành công")))
            .catch(() => res.json(formatResponse(4, "Xóa thất bại")));
    }
    // CREATE
    create(req, res) {
        const color = new Color(req.body);
        color
            .save()
            .then(() => res.json(formatResponse(0, "Thêm màu thành công", color)))
            .catch(() => res.json(formatResponse(4, "Thêm màu thất bại")));
    }

    // GET ONE
    getColorById(req, res) {
        Color.findById(req.params.id)
            .then((color) => {
                res.json(color);
            })
            .catch((err) => {
                res.json(formatResponse(4, "Lấy dữ liệu thất bại!"));
            });
    }

    // GET ALL
    async getAll(req, res) {
        const colors = await Color.find({});
        res.json(colors);
    }
}

module.exports = new ColorController();
