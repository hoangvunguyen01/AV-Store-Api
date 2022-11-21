const Order = require("../models/Order");
const Warehouse = require("../models/Warehouse");
const { formatResponse } = require("../utils/response");
// const { get, set, incrby, exists, setnx, decrby } = require("../services/redis");
require("dotenv").config();
const fetch = require("node-fetch");
class OrderController {
    // CANCEL ORDER
    async cancel(req, res) {
        const order = await Order.findOne({ _id: req.params.id });
        const products = order.products.sort((a, b) => a.sampleId - b.sampleId);
        const sampleIds = products.map((product) => product.sampleId);
        const samples = await Warehouse.find({ _id: { $in: sampleIds } }, "quantity");
        const bulkSamples = samples.map((sample, index) => ({
            updateOne: {
                filter: { _id: sample._id },
                update: {
                    quantity: sample.quantity.map((q) => {
                        const key = Object.keys(q)[0];
                        if (key == products[index].size) {
                            return { [key]: q[key] + products[index].quantity };
                        }
                        return q;
                    }),
                },
            },
        }));

        Warehouse.bulkWrite(bulkSamples)
            .then(() => {
                Order.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
                    .then(() => res.json(formatResponse(0, `Hủy đơn hàng thành công`)))
                    .catch(() => res.json(formatResponse(4, `Hủy đơn hàng thất bại`)));
            })
            .catch(() => res.json(formatResponse(4, "Chỉnh sửa thông tin sản phẩm thất bại")));
    }

    // UPDATE
    update(req, res) {
        Order.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, `Thành công`)))
            .catch(() => res.json(formatResponse(4, `Thất bại`)));
    }

    async createShipOrder(req, res) {
        const order = await Order.findOne({ _id: req.params.id }).populate("userId");
        const sampleIds = order.products.map((product) => product.sampleId);
        const samples = await Warehouse.find({ _id: { $in: sampleIds } })
            .populate("productId", "name weight -_id")
            .populate("colorId", "name -_id");
        const weight = samples.reduce((sum, current) => sum + current.productId.weight, 0);
        const items = samples.map((sample, index) => ({
            name: sample.productId.name,
            quantity: order.products[index].quantity,
            weight: sample.productId.weight,
        }));
        const data = {
            to_name: order.userId.name,
            to_phone: order.userId.phone,
            to_address: order.address.address,
            to_ward_name: order.address.ward.name,
            to_district_name: order.address.district.name,
            to_province_name: order.address.province.name,
            cod_amount: order.amount,
            weight,
            length: req.body.length,
            width: req.body.width,
            height: req.body.height,
            insurance_value: order.amount,
            service_type_id: 2,
            payment_type_id: 1,
            required_note: "CHOXEMHANGKHONGTHU",
            items,
        };

        const result = await fetch(process.env.GHN_CREATE_SHIP, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Token: process.env.TOKEN_GHN,
                ShopId: process.env.SHOP_ID_GHN,
            },
            body: JSON.stringify(data),
        });
        const response = await result.json();
        if (response.code == 200) {
            Order.findByIdAndUpdate(
                { _id: req.params.id },
                { order_code: response.data.order_code, status: "wait-picking" },
                { new: true }
            )
                .then(() => res.json(formatResponse(0, `Xác nhận đơn hàng thành công`, response.data.order_code)))
                .catch(() => res.json(formatResponse(4, `Xác nhận đơn hàng thất bại`)));
        } else {
            return res.json(formatResponse(1, response.message));
        }
    }

    // CREATE
    async create(req, res) {
        let indexFail = -1;
        const products = req.body.products.sort((a, b) => a.sampleId - b.sampleId);
        const sampleIds = products.map((product) => product.sampleId);
        const samples = await Warehouse.find({ _id: { $in: sampleIds } }, "quantity")
            .populate("productId", "name -_id")
            .populate("colorId", "name -_id");

        samples.forEach((sample, index) => {
            sample.quantity.forEach((q) => {
                if (q[products[index].size] == 0 || q[products[index].size] < products[index].quantity) {
                    indexFail = index;
                }
            });
        });
        if (indexFail >= 0) {
            return res.json(
                formatResponse(
                    4,
                    `Sản phẩm ${samples[indexFail].productId.name} 
                    màu ${samples[indexFail].colorId.name} 
                    size ${products[indexFail].size} hết hàng hoặc không đủ số lượng. Xin vui lòng chọn sản phẩm khác.`
                )
            );
        }

        const bulkSamples = samples.map((sample, index) => ({
            updateOne: {
                filter: { _id: sample._id },
                update: {
                    quantity: sample.quantity.map((q) => {
                        const key = Object.keys(q)[0];
                        if (key == products[index].size) {
                            return { [key]: q[key] - products[index].quantity };
                        }
                        return q;
                    }),
                },
            },
        }));

        req.body.userId = req.user.id;
        const order = new Order(req.body);
        order
            .save()
            .then(() => {
                Warehouse.bulkWrite(bulkSamples)
                    .then(() => res.json(formatResponse(0, "Đặt hàng thành công", order._id)))
                    .catch(() => res.json(formatResponse(4, "Đặt hàng thất bại")));
            })
            .catch(() => res.json(formatResponse(4, "Đặt hàng thất bại")));
    }

    // async test(req, res) {
    //     const keyName = "iphone13";
    //     console.log(keyName);
    //     const getKey = exists(keyName);
    //     if (!getKey) {
    //         set(keyName, 0);
    //     }

    //     const slBanRa = await get("youtube");
    //     console.log(slBanRa);
    //     res.json(formatResponse(0, "Đặt hàng thành công"));
    // }

    // GET BY USERID
    async getOrdersByUserId(req, res) {
        if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
            const orders = await Order.find({ userId: req.params.userId });
            res.json(orders);
        } else {
            res.json(false);
        }
    }

    // GET ONE
    getOrderById(req, res) {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            Order.findById(req.params.id)
                .populate("userId", "name phone email")
                .then((order) => {
                    res.json(order);
                })
                .catch((err) => {
                    console.log(err);
                    res.json(formatResponse(4, "Lấy dữ liệu thất bại!"));
                });
        } else {
            res.json(null);
        }
    }

    // GET ALL
    async getAll(req, res) {
        //const qStatus = req.query.status;
        let orders = [];
        if (req.query.page) {
            const page = parseInt(req.query.page);

            if (page < 0) {
                orders = [];
            } else {
                let find = {};

                orders = await Order.find(find, "createdAt status amount")
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * 10)
                    .limit(10);
            }
        }
        res.json(orders);
    }

    // GET MAX PAGE
    async getMaxPage(req, res) {
        const count = await Order.count();
        const maxPage = Math.ceil(count / 10);
        res.json(maxPage ? maxPage : 1);
    }
}

module.exports = new OrderController();
