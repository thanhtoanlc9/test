const Member = require('mongoose').model('Member');

const validator = require('validator');

const axios = require('axios');

const capcha = require('../config/capcha');

const bcrypt = require('bcrypt');

const merge = require('lodash/merge');
const map = require('lodash/map');
const assign = require('lodash/assign');
const find = require('lodash/find');
const clone = require('clone');

const member_transaction = require('./member_transaction');

async function validateMemberForm(payload, remoteip) {

    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0 || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Hãy cung cấp thông tin email.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 6) {
        isFormValid = false;
        errors.password = 'Hãy cung cấp thông tin mật khẩu.';
    }

    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
        isFormValid = false;
        errors.username = 'Hãy cung cấp thông tin tài khoản.';
    }

    if (!payload || typeof payload.phone !== 'string' || payload.phone.trim().length < 10 || isNaN(payload.phone)) {
        isFormValid = false;
        errors.phone = 'Hãy cung cấp thông tin thông tin điện thoại đúng.';
    }

    if (!payload || typeof payload.fullname !== 'string' || payload.fullname.trim().length === 0 || !isNaN(parseInt(payload.fullname))) {
        isFormValid = false;
        errors.fullname = 'Hãy cung cấp thông tin họ tên.';
    }

    if (payload.g_recaptcha_response === undefined || payload.g_recaptcha_response === '' || payload.g_recaptcha_response === null) {
        isFormValid = false;
        errors.capcha = 'Hãy thực hiện captcha.';
    } else {

        const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + capcha.secretKey + "&response=" + payload.g_recaptcha_response + "&remoteip=" + remoteip;

        const fetchData = await axios.get(verificationUrl);

        const data = await fetchData.data;

        if (data.success !== undefined && !data.success) {
            return res.json({ "responseCode": 1, "responseDesc": "Failed captcha verification" });
            isFormValid = false;
            errors.capcha = 'Quá trình kiểm tra captcha đã xảy ra sự cố.';
        }
    }

    if (!isFormValid) {
        message = 'Xảy ra sự cố thông tin bạn cung cấp.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

async function countMember(querySearch = {}) {
    return await Member.find(querySearch).count();
}

exports.getAll = async function(req, res, next) {

    try {

        const members = await member_transaction.getCountMoneyMember(next);

        let { limit, skip, search } = req.query;

        limit = (limit === undefined) ? 10 : parseInt(limit);

        skip = (skip === undefined) ? 0 : parseInt(skip);

        let querySearch = {};

        if (search) {
            querySearch = merge(querySearch, {
                $text: {
                    $search: search
                }
            })
        }

        const count = await countMember(querySearch);

        const results = await Member.find(querySearch).limit(limit).skip(skip).sort({ created: -1 }).exec();

        const mergeResults = map(results, function(result) {

            const member = find(members, { _id: result._id.toString() });

            return {
                _id: result._id,
                username: result.username,
                fullname: result.fullname,
                email: result.email,
                phone: result.phone,
                created: result.created,
                lastlogin: result.lastlogin,
                fun: member ? member.total : 0
            };

        });

        return res.json({
            data: mergeResults,
            count: count,
            limit: limit,
            skip: skip
        });

    } catch (err) {
        next(err);
    }

};

exports.get = function(req, res) {

    const { id } = req.params;

    Member.findById(id, function(err, result) {
        if (err) return res.send(err);
        return res.json(result);

    });
};

exports.update = async function(req, res) {

    const validationResult = await validateMemberForm(req.body);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    const { id } = req.params;

    var data = {
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone
    };

    if (req.body.password !== "") {

        const salt = await bcrypt.genSalt();

        const hash = await bcrypt.hash(req.body.password, salt);

        data.password = hash;

    }

    Member.update({ _id: id }, data, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({ message: `${success.nModified} thông tin đã được sửa.` });
    });

};

exports.delete = function(req, res) {

    const { id } = req.params;

    Member.findByIdAndRemove(id).exec(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Xóa thông tin thành công"
        });
    });

};

exports.create = async function(req, res) {

    const validationResult = await validateMemberForm(req.body, req.connection.remoteAddress);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    var list_member = req.body;

    list_member.created = new Date();

    var data = new Member(list_member);

    data.save(function(err, room) {

        console.log(err);

        if (err) {
            if (err.code === 11000) {
                return res.json({
                    success: false,
                    message: "Email hoạc là username đã được đăng ký."
                });
            }
        }

        return res.json({
            success: true,
            message: "Tạo tài khoản thành công"
        });
    });
};
