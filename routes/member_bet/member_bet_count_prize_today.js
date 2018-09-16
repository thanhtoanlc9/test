const MemberBet = require('mongoose').model('MemberBet');
const date = require('../../helpers/time');
// Count all bet of member
module.exports = (req, res, next) => {
	const result = req.result;

    MemberBet.find({date: result.date,bet_mark: {$gt : 2}}).count((err, count) => {

        if (err) res.send(err);
        
        if (count == 0) return res.json({
            message: 'Không thể tìm ra thành viên trúng giải hôm nay.'
        });

        req.member_bet_count_prize_today = count;

        next();
    });
}