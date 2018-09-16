var request = require('request');
//var cheerio = require('cheerio');
var clone = require('clone');

const Member_bet = require('mongoose').model('MemberBet');

const includes = require('lodash/includes');

module.exports =  (req, res, next) => {

    // Todo: check result
    const { lottery_loto, date } = req.latest_result;
    
    Member_bet.find({ 'date': date }, '_id bets', (err, members) => {

        if (err) return res.send(err);

        members.forEach(member => {

            const { _id, bets } = member;

            let bet_mark = 0;

            let list_lottery = clone(lottery_loto);

            for (var i = 0; i < bets.length; i++) {
                /*if (includes(lottery_loto, bets[i])) {
                    bet_mark++;
                }*/
                for (var j = 0; j < list_lottery.length; j++) {
                    if (bets[i] == list_lottery[j]) {
                        bet_mark++;
                        delete list_lottery[j];
                        break;
                    }
                }
            }

            Member_bet.update({ '_id': _id }, { $set: { 'status': 1, 'bet_mark': bet_mark } }, function(err, updated) {});

        });

        req.body.amount = 0;
        return next();
    });
    

};
