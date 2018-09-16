const MemberBet = require('mongoose').model('MemberBet');

const date = require('../../helpers/time');

module.exports = (req, res) => {

    const dateBetToday = date.getDateBet().format('DD-MM-YYYY').toString();

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    if (skip < 0)  {
        skip = 0;
    }

    MemberBet.find({date: dateBetToday}).limit(limit).skip(skip).sort({ $natural: -1 }).exec((err, results) => {

        if (err) res.send(err);

        res.json({
            total_money_bet_today: req.total_money_bet_today,
            data: results,
            count: req.member_bet_count,
            limit: limit,
            skip: skip
        });

    });

};