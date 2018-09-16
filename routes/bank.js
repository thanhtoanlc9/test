const Bank = require('mongoose').model('Bank');

let allDocumentCount = Bank.find({});

let allDocument = Bank.find({});

exports.getAll = function(req, res) {

   let { limit, skip } = req.query;

    limit = (limit === undefined)? 10 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    allDocument.limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);

        allDocumentCount.count( (err, count) => {

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

exports.get = function(req, res) {

    const { id } = req.params;

    Bank.findById(id, function(err, result) {
        if (err) return res.send(err);
        return res.json(result);
    });

};

exports.update = function(req, res) {

    const { id } = req.params;
    Bank.update({ _id: id }, req.body, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.`
        });
    });

};

exports.delete = function(req, res) {

    const { id } = req.params;

    Bank.findByIdAndRemove(id).exec(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Xóa thông tin thành công"
        });
    });

};

async function validateBankForm(payload) {

    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.bankname !== 'string' || payload.bankname.trim().length === 0) {
        isFormValid = false;
        errors.email = 'Hãy cung cấp tên ngân hàng.';
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

exports.create = async function(req, res) {

    const validationResult = await validateBankForm(req.body);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    const { bankname } = req.body;

    var data = new Bank({
        bankname: bankname,
        created: new Date(),
    });

    data.save(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Tạo thông tin thành công"
        });
    });

};