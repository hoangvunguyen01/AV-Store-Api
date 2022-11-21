const Warehouse = require("../models/Warehouse");
const { formatResponse } = require("../utils/response");

class WarehouseController {
    // UPDATE
    update(req, res) {
        Warehouse.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, "Chỉnh sửa thành công")))
            .catch(() => res.json(formatResponse(4, "Chỉnh sửa thất bại")));
    }

    // DELETE
    delete(req, res) {
        Warehouse.delete({ _id: req.params.id })
            .then(() => res.json(formatResponse(0, "Xóa thành công")))
            .catch(() => res.json(formatResponse(4, "Xóa thất bại")));
    }

    // GET BY ID PRODUCT
    getSamplesByProductId(req, res) {
        Warehouse.find({ productId: req.params.id }, "colorId image quantity")
            .populate("colorId", "name hex-_id")
            .then((samples) => {
                res.json(samples);
            })
            .catch((err) => {
                res.json(formatResponse(4, "Lấy dữ liệu thất bại!"));
            });
    }

    // GET BY ID
    getById(req, res) {
        Warehouse.findOne({ _id: req.params.id }, "colorId image productId")
            .populate("productId", "name discount price")
            .populate("colorId", "name hex -_id")
            .then((sample) => {
                res.json(sample);
            })
            .catch((err) => {
                res.json(formatResponse(4, "Lấy dữ liệu thất bại!"));
            });
    }

    // GET ALL
    async getAll(req, res) {
        let samples = [];
        if (req.query.page) {
            const page = parseInt(req.query.page);
            samples =
                page < 0
                    ? []
                    : await Warehouse.find({}, "productId colorId image quantity")
                          .populate("productId", "name categoryId -_id")
                          .populate("colorId", "name hex -_id")
                          .sort({ _id: -1 })
                          .skip((page - 1) * 10)
                          .limit(10);
        }
        res.json(samples);
    }

    // GET MAX PAGE
    async getMaxPage(req, res) {
        const count = await Warehouse.count();
        const maxPage = Math.ceil(count / 10);
        res.json(maxPage ? maxPage : 1);
    }
}

module.exports = new WarehouseController();
