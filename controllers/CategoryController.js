const Category = require("../models/Category");
const { formatResponse } = require("../utils/response");
require("dotenv").config();

class CategoryController {
    // UPDATE
    update(req, res) {
        Category.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, "Chỉnh sửa thành công", req.body)))
            .catch(() => res.json(formatResponse(4, "Chỉnh sửa thất bại")));
    }

    // DELETE
    delete(req, res) {
        Category.delete({ _id: req.params.id })
            .then(() => res.json(formatResponse(0, "Xóa thành công")))
            .catch(() => res.json(formatResponse(4, "Xóa thất bại")));
    }
    // CREATE
    create(req, res) {
        const category = new Category(req.body);
        category
            .save()
            .then(() => res.json(formatResponse(0, "Thêm danh mục thành công", category)))
            .catch(() => res.json(formatResponse(4, "Thêm danh mục thất bại")));
    }

    // GET ONE BY SLUG
    getCategoryBySlug(req, res) {
        Category.findOne({ slug: req.params.slug }, "name imgLarge imgSmall sizes slug")
            .then((category) => {
                res.json(category);
            })
            .catch((err) => {
                res.json(formatResponse(4, "Lấy dữ liệu thất bại!"));
            });
    }

    // GET ALL
    async getAll(req, res) {
        const categories = await Category.find({}, "name imgLarge imgSmall sizes slug");
        res.json(categories);
    }
}

module.exports = new CategoryController();
