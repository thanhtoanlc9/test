const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 10 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    if (skip < 0) {
        skip = 0;
    }

    MemberTransaction.find({ type: "recharge"}).limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);

        res.json({
            data: results,
            count: req.member_recharge_admin,
            limit: limit,
            skip: skip
        });

    });

};