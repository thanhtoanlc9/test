const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    MemberTransaction.find({ type: "recharge" }).count((err, count) => {

        if (err) res.send(err);

        req.member_recharge_admin = count;

        next();
    });

}