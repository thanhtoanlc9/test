var express = require('express');

var router = express.Router();

const MemberBet = require('mongoose').model('MemberBet');

const date = require('../../helpers/time');
// Get bets info of member
router.get('/', function (req, res, next) {
    const dateBetToday = date.getDateBet().format('DD-MM-YYYY').toString();
    console.log('test dateBetToday', dateBetToday);
    MemberBet.aggregate([
        {
            $match: {
                date: dateBetToday
            }
        },
        {
            $group: {
                _id: dateBetToday,
                total: { $sum: "$amount" }
            }
        }
    ]).exec((err, result) => {

        if (err) {
            req.total_money_bet_today = 0 ;
            next();
        }

        req.total_money_bet_today = result === undefined || result.length == 0 ? 0: result[0]['total'];
        next();

    });

});

module.exports = router;
