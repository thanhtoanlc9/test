const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    const { _id } = req.member;

    MemberTransaction.find({ member_id: _id, type: "recharge" }).count((err, count) => {

        if (err) res.send(err);

        req.member_recharge_transaction = count;

        next();
    });

}