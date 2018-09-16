const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

	const {_id} = req.member;

    MemberTransaction.find({member_id: _id, type: "withdraw"}).count((err, count) => {

        if (err) res.send(err);

        req.member_count_withdraw = err ? 0: count;

        next();
    });

}
