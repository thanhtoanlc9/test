const MemberTransaction = require('mongoose').model('MemberTransaction');

const date = require('../../helpers/time');

module.exports = (req, res, next) => {

    let transaction = req.transaction;
    transaction.created = new Date();
    transaction.date = date.todayDate();
    /*transaction.type = "recharge";*/

    const memberTransaction = new MemberTransaction(transaction);

    const trans = memberTransaction.save();
    req.transaction_id = trans._id;
    return next();
}
