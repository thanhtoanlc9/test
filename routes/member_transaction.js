const MemberTransaction = require('mongoose').model('MemberTransaction');

const date = require('../helpers/time');

let allDocumentCount = MemberTransaction.find({});

let allDocument = MemberTransaction.find({});

async function validateTransactionForm(payload) {

    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.amount !== 'number' || payload.amount == 0) {
        isFormValid = false;
        errors.amount = 'Hãy cung cấp số tiền.';
    }

    if (!payload || typeof payload.type !== 'string' || (payload.type !== "withdraw" && payload.type !== "recharge")) {
        isFormValid = false;
        errors.type = 'Thông tin loại giao dịch sai.';
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

async function countTransaction(querySearch = {}) {
    return await MemberTransaction.find(querySearch).count();
}

exports.getAll = async function(req, res) {

    try {

        let { limit, skip, search, member_username } = req.query;

        limit = (limit === undefined) ? 10 : parseInt(limit);

        skip = (skip === undefined) ? 0 : parseInt(skip);

        let querySearch = {};

        if (search == 'withdraw' || search == "recharge" || search == "bets") {
            querySearch.type = search;
        }
        if ( member_username !== null && member_username !== '' && typeof member_username == 'string' ) {
            querySearch.member_username = member_username;
        }
        const count = await countTransaction(querySearch);

        const results = await MemberTransaction.find(querySearch).limit(limit).skip(skip).sort({ created: -1 }).exec();

        return res.json({
            data: results,
            count: count,
            limit: limit,
            skip: skip
        });

    } catch (err) {
        next(err);
    }

};

exports.getMember = function(req, res) {

    //const { _id, fullname, email, phone } = req.member;

    var { _id } = req.member;

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    MemberTransaction.find({ member_id: _id }).limit(limit).skip(skip).sort({ date: -1 }).exec((err, results) => {

        if (err) res.send(err);

        MemberTransaction.find({ member_id: _id }).count((err, count) => {

            if (err) res.send(err);

            res.json({
                data: results,
                count: count,
                limit: limit,
                skip: skip
            });
        })

    });

};

// get history of member
exports.getListHistory = function(req, res) {

    const { _id } = req.member;

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    MemberTransaction.find({ member_id: _id, status: 1 }).limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);

        MemberTransaction.find({ member_id: _id, status: 1 }).count((err, count) => {

            if (err) res.send(err);

            res.json({
                data: results,
                count: count,
                limit: limit,
                skip: skip
            });
        })
    });

};

//Total money of a member
exports.getCountMoney = function(req, res) {

    const { _id } = req.member;

    MemberTransaction.aggregate([{
            $match: {
                member_id: _id,
                status: 1
            }
        },
        {
            $group: {
                _id: _id,
                total: { $sum: "$amount" }
            }
        }
    ]).exec((err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

};

exports.getCountMoneyMember = async function(next) {
    try {
        const members = await MemberTransaction.aggregate([{
                $match: {
                    status: true
                }
            },
            {
                $group: {
                    _id: "$member_id",
                    total: { $sum: "$amount" }
                }
            }
        ]).exec();

        return members;

    } catch (err) {
        return 0;
    }
}

exports.update = function(req, res) {

    const { id } = req.params;

    MemberTransaction.update({ _id: id }, req.body, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.`
        });
    });

};

exports.delete = function(req, res) {

    const { id } = req.params;

    MemberTransaction.findByIdAndRemove(id).exec(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Xóa thông tin thành công"
        });
    });

};

exports.create = async function(req, res) {

    const validationResult = await validateTransactionForm(req.body);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    };

    var data = new MemberTransaction(req.body);
    data.currency = "VND";
    data.created = new Date();
    data.date = date.todayDate();
    data.data = {
        type: "admin",
        status: true,
        update: new Date()
    }
    data.save(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Tạo thông tin thành công"
        });
    });

};
