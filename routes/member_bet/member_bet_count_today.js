const MemberBet = require('mongoose').model('MemberBet');

const date = require('../../helpers/time');

// Count all bet in collection
module.exports = (req, res, next) => {

	const dateBetToday = date.getDateBet().format('DD-MM-YYYY').toString();

    MemberBet.find({date: dateBetToday}).count((err, count) => {

        if (err) res.send(err);

        req.member_bet_count = count;

        next();
    });

}