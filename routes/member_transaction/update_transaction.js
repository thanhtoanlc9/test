const MemberTransaction = require('mongoose').model('MemberTransaction');
const date = require('../../helpers/time');

module.exports = (req, res, next) => {
	const {PAYMENT_ID} = req.body; 
    
    MemberTransaction.update({ _id: PAYMENT_ID }, {status: 1}, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.`
        });
    });

}
        



