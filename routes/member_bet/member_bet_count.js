const MemberBet = require('mongoose').model('MemberBet');

// Count all bet in collection
module.exports = (req, res, next) => {

    MemberBet.find({}).count((err, count) => {

        if (err) res.send(err);

        req.member_bet_count = count;

        next();
    });

}