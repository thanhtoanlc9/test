const MemberBet = require('mongoose').model('MemberBet');

module.exports = (req, res) => {

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    if (skip < 0)  {
        skip = 0;
    }

    MemberBet.find({}).limit(limit).skip(skip).sort({ $natural: -1 }).exec((err, results) => {

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