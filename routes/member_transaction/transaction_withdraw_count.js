const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    MemberTransaction.find({type: 'withdraw'}).count((err, count) => {

        if (err) res.send(err);

        req.member_count_withdraw = count;

        next();
    });

}