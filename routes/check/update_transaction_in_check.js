
const MemberTransaction = require('mongoose').model('MemberTransaction');

var request = require('request');

const includes = require('lodash/includes');

const date = require('../../helpers/time');

module.exports =  (req, res, next) => {

    const newWin = req.newResult;
    if (newWin != null) {
        newWin.forEach(memberWin => {
        
            var transaction = new MemberTransaction({
                member_id: memberWin.member_id,
                member_username: memberWin.username,
                transaction: 'Trúng thưởng ' + memberWin.prize_text + ' ngày ' + req.latest_result.date,
                currency: 'VND',
                date: date.todayDate(),
                amount: memberWin.amount_net,
                status: true,
                type: "win",
                created: new Date(),
                data:{
                }
            });

            transaction.save( (err,data) => {
                if (err) return res.send(err);
                console.log(data.created);
            });
        });
        
    }

    return next();

};
