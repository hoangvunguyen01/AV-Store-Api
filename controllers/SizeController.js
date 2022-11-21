const Size = require("../models/Size");
const { formatResponse } = require("../utils/response");

class SizeController {
    // UPDATE
    update(req, res) {
        Size.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, "Chỉnh sửa thành công")))
            .catch(() => res.json(formatResponse(4, "Chỉnh sửa thất bại")));
    }

    // DELETE
    delete(req, res) {
        Size.deleteOne({ _id: req.params.id })
            .then(() => res.json(formatResponse(0, "Xóa thành công")))
            .catch(() => res.json(formatResponse(4, "Xóa thất bại")));
    }
    // CREATE
    create(req, res) {
        const size = new Size(req.body);
        size.save()
            .then(() => res.json(formatResponse(0, "Thêm kích thước thành công")))
            .catch(() => res.json(formatResponse(4, "Thêm kích thước thất bại")));
    }

    // GET ONE
    getSizeById(req, res) {
        Size.findById(req.params.id)
            .then((size) => {
                res.json(size);
            })
            .catch((err) => {
                res.json(formatResponse(4, "Lấy dữ liệu thất bại!"));
            });
    }

    // GET ALL
    async getAll(req, res) {
        const start = req.query.start ? parseInt(req.query.start) : 0;
        let sizes = await Size.find({}).sort({ createdAt: -1 }).skip(start).limit(8);
        res.json(sizes);
    }
}

module.exports = new SizeController();
