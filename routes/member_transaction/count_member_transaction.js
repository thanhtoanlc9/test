const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    const { _id } = req.member;

    const {date} = req.query;

    MemberTransaction.find({date: date, type: 'win'}).count((err, count) => {

        if (err) res.send(err);

        req.member_count_transaction = count;

        next();
    });

}