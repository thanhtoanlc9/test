const MemberBet = require('mongoose').model('MemberBet');

// Count all bet of member
module.exports = (req, res, next) => {

    const member = req.member;

    const { _id } = member;

    if (!member) return res.json({
        message: 'Không thể tìm thấy thành viên.'
    });

    MemberBet.find({ member_id: _id }).count((err, count) => {

        if (err) res.send(err);

        req.member_bet_count_history = count;

        next();
    });
}