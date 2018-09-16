const WithDraw = require('mongoose').model('WithDraw');

const date = require('../../helpers/time');

// Create a bet
module.exports = (req, res, next) => {

    const { amount } = req.body;

    if (req.total_money_member < amount) {

        return res.send({
            success: false,
            message: 'Số tiền bạn muốn rút vượt quá số tiền trong tài khoản hiện đang có của bạn.'
        });

    }

    const member = req.member;

    var data = new WithDraw({
        member_id: member._id,
        member_username: member.username,
        amount: amount,
        bank_name: req.body.bank_name,
        bank_number: req.body.bank_number,
        bank_location: req.body.bank_location,
    });

    data.save(function(err, bet) {

        if (err) return res.send(err);

        req.transaction = {
            member_id: member._id,
            member_username: member.username,
            amount: -amount,
            date: date.todayDate(),
            transaction: `Bạn đã rút ` + amount,
            currency: 'VND',
            status: true
        };

        return next();
    });

}