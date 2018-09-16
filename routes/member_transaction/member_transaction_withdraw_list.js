const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    const {_id} = req.member;

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    if (skip < 0) {
        skip = 0;
    }

    MemberTransaction.find({member_id: _id, type: 'withdraw'}).limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);
        console.log(results);
        res.json({
            data: results,
            count: req.member_count_withdraw,
            limit: limit,
            skip: skip
        });

    });

};