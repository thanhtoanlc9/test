const Card = require('mongoose').model('Card');

let allDocumentCount = Card.find({});

let allDocument = Card.find({});

async function validateCardForm(payload) {

    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.code_card !== 'string' || payload.code_card.trim().length === 0) {
        isFormValid = false;
        errors.code_card = 'Hãy cung cấp thông tin mã thẻ.';
    }

    if (!payload || typeof payload.card_serial !== 'string' || payload.card_serial.trim().length === 0) {
        isFormValid = false;
        errors.card_serial = 'Hãy cung cấp thông tin Serial của thẻ.';
    }

    if (!payload || typeof payload.amount !== 'string' || payload.amount.trim().length === 0 || (payload.amount !== '10000' && payload.amount !== '20000' && payload.amount !== '50000' && payload.amount !== '100000' && payload.amount !== '200000' && payload.amount !== '500000')) {
        isFormValid = false;
        errors.amount = 'Hãy cung cấp thông tin giá trị của thẻ.';
    }

    if (!payload || typeof payload.card_type !== 'string' || payload.card_type.trim().length === 0 ) {
        isFormValid = false;
        errors.card_type = 'Hãy cung cấp thông tin loại thẻ.';
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

async function countCard(querySearch = {}) {
    return await Card.find(querySearch).count();
}

exports.getAll = async function(req, res) {

   try {

        let { limit, skip, search, money } = req.query;

        limit = (limit === undefined) ? 10 : parseInt(limit);

        skip = (skip === undefined) ? 0 : parseInt(skip);

        let querySearch = {};

        if (search == '1') {
            querySearch.status = true;
        } else if (search == '0') {
            querySearch.status = false;
        }

        if (money == '10000'
            || money == '20000'
            || money == '50000'
            || money == '100000' 
            || money == '200000'
            || money == '500000') {
            querySearch.amount = parseInt(money)
        }

        const count = await countCard(querySearch);
        const results = await Card.find(querySearch).limit(limit).skip(skip).sort({ created: -1 }).exec();
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

exports.count = function(req, res) {

    Card.aggregate([{
                $match: {
                    status: false
                }
            },
            {
                $group: {
                    _id : { amount: "$amount", card_type: "$card_type" },
                    total: { $sum: 1 }
                }
            }
        ]).exec((err, data) => {
            if (err) return res.send(err);
            return res.json({data: data});
        });

};

exports.get = function(req, res) {

    const { id } = req.params;

    Card.findById(id, function(err, result) {
        if (err) return res.send(err);
        return res.json(result);
    });

};

exports.update = async function(req, res) {
    
    const validationResult = await validateCardForm(req.body);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    const { id } = req.params;
    Card.update({ _id: id }, req.body, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.`
        });
    });

};

exports.delete = function(req, res) {

    const { id } = req.params;

    Card.findByIdAndRemove(id).exec(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Xóa thông tin thành công"
        });
    });

};

exports.create = async function(req, res) {

    const validationResult = await validateCardForm(req.body);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    let card = req.body;
    card.amount = parseInt(req.body.amount);
    card.created = new Date();
    var data = new Card(card);

    data.save(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Tạo thông tin thành công"
        });
    });

};