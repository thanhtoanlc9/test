const MemberTransaction = require('mongoose').model('MemberTransaction');

const date = require('../../helpers/time');

module.exports = (req, res, next) => {

    MemberTransaction.find({type: 'recharge', date: date.todayDate()}).count((err, count) => {

        if (err) res.send(err);

        req.member_count_recharge = count;

        next();
    });

}