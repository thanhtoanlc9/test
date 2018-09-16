const MemberBet = require('mongoose').model('MemberBet');

const date = require('../../helpers/time');

// Create a bet
module.exports = (req, res, next) => {

    const { amount } = req.body;

    if (req.total_money_member < amount) {

        return res.send({
            success: false,
            message: 'Số tiền trong tài khoản của bạn không đủ để chơi.'
        });

    }

    const member = req.member;

    const { bets } = req.body;

    const dateBetToday = date.getDateBet();

    var data = new MemberBet({
        member_id: member._id,
        member_username: member.username,
        member_fullname: member.fullname,
        day: dateBetToday.format('DD').toString(),
        month: dateBetToday.format('MM').toString(),
        year: dateBetToday.format('YYYY').toString(),
        date: dateBetToday.format('DD-MM-YYYY').toString(),
        bets: bets,
        amount: amount,
        status: 0,
        check: null,
        created: new Date()
    });

    data.save(function(err, bet) {

        if (err) return res.send(err);

        req.bet_id = bet._id;

        req.transaction = {
            member_id: member._id,
            member_username: member.username,
            amount: -amount,
            date: date.todayDate(),
            transaction: `Bạn đã đặt cược ${bets.join(',')}`,
            currency: 'VND',
            type: "bets",
            status: true,
            data:{
                bets:bets
            }
        };
        
        return next();

    });

}