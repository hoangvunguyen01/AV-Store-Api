const bcrypt = require("bcrypt");
const User = require("../models/User");
const Cart = require("../models/Cart");
const Otp = require("../models/Otp");
const { formatResponse } = require("../utils/response");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mail");
const mongoose = require("mongoose");
const { createRandomNumber } = require("../utils/random");
require("dotenv").config();

class UserController {
    // PUT UPDATE INFO
    async updateInfo(req, res) {
        req.body.address = { province: req.body.province, district: req.body.district, ward: req.body.ward };
        User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, "Cập nhật tài khoản thành công", req.body.address)))
            .catch(() => res.json(formatResponse(4, "Cập nhật tài khoản thất bại")));
    }

    // PUT CHANGE PASSWORD
    async changePassword(req, res) {
        let { password, newPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(newPassword, salt);
        const user = await User.findById({ _id: req.params.id });
        const comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return res.json(formatResponse(1, "Mật khẩu cũ không chính xác."));
        } else {
            User.findByIdAndUpdate({ _id: req.params.id }, { password: newPassword }, { new: true })
                .then(() => res.json(formatResponse(0, "Đổi mật khẩu thành công")))
                .catch(() => res.json(formatResponse(4, "Đổi mật khẩu thất bại")));
        }
    }

    // POST REGISTER
    async register(req, res) {
        const { email } = req.body;

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.json(formatResponse(1, "Email này đã được sử dụng."));
        } else {
            const user = new User(req.body);
            const cart = new Cart({ userId: user._id });

            user.save()
                .then(() => {
                    cart.save()
                        .then(() => {
                            const token = jwt.sign({ user }, process.env.JWT_VERIFY, { expiresIn: "6h" });

                            const mailOptions = {
                                to: email,
                                subject: "Xác minh email tài khoản AV Store",
                                html: `
                            <h2>Xác minh địa chỉ email để hoàn thành việc đăng ký tài khoản và đăng nhập vào tài khoản của bạn.</h2>
                            <p>Đường link có <b>thời hạn là 6 tiếng.</b></p>
                            <a href="https://av-store.herokuapp.com/confirm-account/${token}" target="_blank">Click here</a>       
                            `,
                            };

                            transporter.sendMail(mailOptions, (error) => {
                                if (error) {
                                    console.log(error);
                                    return res
                                        .status(500)
                                        .json(formatResponse(4, "Đã có lỗi xảy ra, vui lòng đăng ký lại. "));
                                }
                                return res.json(
                                    formatResponse(0, "Vui lòng kiểm tra email của bạn để xác thực tài khoản")
                                );
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            return res.json(formatResponse(4, "Đăng ký tài khoản thất bại"));
                        });
                })
                .catch((error) => {
                    console.log(error);
                    return res.json(formatResponse(4, "Đăng ký tài khoản thất bại"));
                });
        }
    }

    // VERIFY TOKEN
    async verify(req, res) {
        const token = req.params.token;
        if (token) {
            jwt.verify(token, process.env.JWT_VERIFY, (err, decodedToken) => {
                if (err) {
                    return res
                        .status(400)
                        .json(formatResponse(1, "Link không chính xác hoặc đã hết thời gian xác thực."));
                }
                let user = decodedToken.user;
                User.findOneAndUpdate({ _id: user._id, verified: false }, { verified: true }, { new: true })
                    .then(() => res.json(formatResponse(0, "Xác thực thành công")))
                    .catch(() => res.json(formatResponse(4, "Xác thực thất bại")));
            });
        }
    }

    // POST LOGIN
    async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate("roleId", "permission -_id");

        if (user) {
            if (user.blocked) {
                return res.json(formatResponse(1, "Tài khoản đã bị khóa"));
            }
            if (user.verified) {
                const comparePassword = bcrypt.compareSync(password, user.password);
                if (comparePassword) {
                    const accessToken = jwt.sign(
                        { id: user._id, permission: user.roleId.permission },
                        process.env.JWT_SEC,
                        {
                            expiresIn: "3d",
                        }
                    );

                    const { password, ...others } = user._doc;
                    if ((user.roleId.permission & 4) == 4) {
                        others.isAdmin = true;
                    }

                    const cart = await Cart.findOne({ userId: others._id });
                    return res.json(formatResponse(0, "Đăng nhập thành công.", { others, accessToken, cart }));
                }
            } else {
                return res.json(formatResponse(1, "Tài khoản chưa xác thực email."));
            }
        }

        return res.json(formatResponse(1, "Tên tài khoản hoặc mật khẩu không chính xác.", user));
    }

    // GET ONE
    getUserById(req, res) {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            User.findById(req.params.id)
                .then((user) => {
                    res.json(user);
                })
                .catch((err) => {
                    res.json(formatResponse(4, "Lấy dữ liệu thất bại!"));
                });
        } else {
            res.json(null);
        }
    }

    // LOGIN GOOGLE
    async loginGoogle(req, res) {
        const user = req.user;
        if (user) {
            if (user.blocked) {
                return res.json(formatResponse(1, "Tài khoản đã bị khóa"));
            }

            const accessToken = jwt.sign({ id: user._id, permission: user.roleId.permission }, process.env.JWT_SEC, {
                expiresIn: "3d",
            });

            const { password, createdAt, updatedAt, __v, ...others } = user;
            const cart = await Cart.findOne({ userId: others._id });
            return res.json(formatResponse(0, "Đăng nhập thành công.", { others, accessToken, cart }));
        } else {
            return res.json(formatResponse(3, ""));
        }
    }

    // LOGIN FAILED
    loginFailed(req, res) {
        res.json(formatResponse(2, "Đăng nhập thất bại. Vui lòng thử lại"));
    }

    // RESEND LINK VERIFY
    async resendLinkVerify(req, res) {
        const { email } = req.body;
        const user = await User.findOne({ email, verified: false });
        if (user) {
            const token = jwt.sign({ user }, process.env.JWT_VERIFY, { expiresIn: "6h" });
            const mailOptions = {
                to: email,
                subject: "Gửi lại link xác thực email tài khoản AV Store",
                html: `
            <h2>Xác minh địa chỉ email để hoàn thành việc đăng ký tài khoản và đăng nhập vào tài khoản của bạn.</h2>
            <p>Đường link có <b>thời hạn là 6 tiếng.</b></p>
            <a href="https://av-store.herokuapp.com/confirm-account/${token}" target="_blank">Click here</a>       
            `,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json(formatResponse(4, "Đã có lỗi xảy ra, vui lòng đăng ký lại. "));
                }
                return res.json(formatResponse(0, "Vui lòng kiểm tra email của bạn để xác thực tài khoản"));
            });
        } else {
            res.json(formatResponse(1, "Địa chỉ email chưa đăng ký hoặc tài khoản đã được xác thực"));
        }
    }

    // SEND OTP
    async sendOtp(req, res) {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const otp = createRandomNumber(6);
            const OTP = new Otp({ email, otp });
            const mailOptions = {
                to: email,
                subject: "Mã OTP xác thực đổi mật khẩu",
                html: `
                    <h2>Mã OTP xác thực đổi mật khẩu có thời hạn 5 phút.</h2>
                    <p>Mã OTP là <b>${otp}.</b></p>
                    `,
            };

            OTP.save().catch(() => res.json(formatResponse(4, "Đã có lỗi xảy ra, vui lòng thực hiện lại.")));

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json(formatResponse(4, "Đã có lỗi xảy ra, vui lòng thực hiện lại."));
                }
                return res.json(formatResponse(0, "Mã OTP vừa được gửi vào email của bạn."));
            });
        } else {
            return res.json(formatResponse(1, "Địa chỉ email chưa đăng ký tài khoản"));
        }
    }

    // [POST] CHANGE PASSWORD
    async changePasswordWithOTP(req, res) {
        let { email, otp, password } = req.body;
        const OTP = await Otp.findOne({ email, otp }).sort({ _id: -1 });
        if (OTP) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            User.findOneAndUpdate({ email }, { password }, { new: true })
                .then(() => res.json(formatResponse(0, "Đổi mật khẩu thành công")))
                .catch(() => res.json(formatResponse(4, "Đổi mật khẩu thất bại")));
        } else {
            return res.json(formatResponse(1, "Mã OTP không chính xác hoặc đã hết hạn."));
        }
    }

    // GET ALL USER
    async getAll(req, res) {
        let users = [];
        if (req.query.page) {
            const page = parseInt(req.query.page);

            if (page < 0) {
                users = [];
            } else {
                users = await User.find({ roleId: { $lt: 1 } })
                    .select("-updatedAt -deleted -__v")
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * 10)
                    .limit(10);
            }
        }
        res.json(users);
    }

    // GET MAX PAGE
    async getMaxPage(req, res) {
        const count = await User.count();
        const maxPage = Math.ceil(count / 10);
        res.json(maxPage ? maxPage : 1);
    }

    // BLOCK / UNBLOCK
    blockAndUnblock(req, res) {
        User.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true })
            .then(() => res.json(formatResponse(0, "Thành công")))
            .catch(() => res.json(formatResponse(4, "Thất bại")));
    }
}

module.exports = new UserController();
