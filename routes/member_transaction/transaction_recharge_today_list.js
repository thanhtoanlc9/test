const MemberTransaction = require('mongoose').model('MemberTransaction');

const date = require('../../helpers/time');

module.exports = (req, res, next) => {

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    if (skip < 0) {
        skip = 0;
    }

    MemberTransaction.find({type: 'recharge', date: date.todayDate()}).limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);
        res.json({
            data: results,
            count: req.member_count_recharge,
            limit: limit,
            skip: skip
        });

    });

};