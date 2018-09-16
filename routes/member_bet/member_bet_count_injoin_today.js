const MemberBet = require('mongoose').model('MemberBet');
const date = require('../../helpers/time');
// Count all bet of member
module.exports = (req, res, next) => {

    MemberBet.find({date:date.todayDate()}).count((err, count) => {

        if (err) res.send(err);
        if (count == 0) return res.json({
            message: 'Không thể tìm ra thành viên tham gia hôm nay.'
        });

        req.member_bet_count_injoin_today = count;

        next();
    });
}