const MemberTransaction = require('mongoose').model('MemberTransaction');

const date = require('../../helpers/time');

// Data for transaction will save in database
module.exports =   (req, res, next) => {

    const {_id} = req.member;
    
    const payload = req.body;
    
    new MemberTransaction({

    	member_id : _id,
        date : date.todayDate(),
        transaction : payload.transaction,
        currency : 'VND',
        amount : payload.amount,
        status : payload.status,
        type: payload.type,
        created: new Date(),
        data: {}

    }).save(function(err) {
        if (err) {
            return;
        }
        return next();
    });

};