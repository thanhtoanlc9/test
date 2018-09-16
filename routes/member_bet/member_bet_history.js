var express = require('express');
var router = express.Router();

const MemberBet = require('mongoose').model('MemberBet');

// Get bets info of member
router.get('/', function(req, res, next) {

    const member = req.member;

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    MemberBet.find({ member_id:  member._id}).limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {
        
        if (err) res.send(err);

        res.json({
            data: results,
            count: req.member_bet_count_history,
            limit: limit,
            skip: skip
        });

    });

});

module.exports = router;
