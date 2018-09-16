const router = require('express').Router();
const md5 = require('md5');
const config = require('../config/perfectmoney');
const MemberTransaction = require('mongoose').model('MemberTransaction');
const date = require('../helpers/time');
router.post('/', function(req, res) {

    const payload = req.body;
    const member = req.member; 

    new MemberTransaction({
        member_id: member._id,
        member_username: req.member.username,
        transaction: `Bạn đã nạp ${payload.amount}$ từ PefectMoney vào tài khoản và được quy đổi sang ${payload.amount * 22750} điểm`,
        currency: 'VND',
        date: date.todayDate(),
        amount: payload.amount * 22750,
        type: "recharge",
        status: false,
        created: new Date(),
        data: {
            type: "perfectmoney"
        }
    }).save(function(err, transaction) {
        if (err) res.send(err);

        return res.json({
            success: true,
            id: transaction._id
        });

    });
});

router.post('/callback', function(req, res) {

    const payload = req.body;

    const { PAYMENT_ID, 
        PAYEE_ACCOUNT, 
        V2_HASH, 
        PAYMENT_AMOUNT, 
        PAYMENT_BATCH_NUM, 
        PAYER_ACCOUNT, 
        TIMESTAMPGMT, PAYMENT_UNITS } = req.body;

    if (!PAYMENT_ID) {
        return res.json({
            success: false
        });
    }

    // console.log('payload', payload);

    const string = PAYMENT_ID + ':' + PAYEE_ACCOUNT + ':' +
        PAYMENT_AMOUNT + ':' + PAYMENT_UNITS + ':' +
        PAYMENT_BATCH_NUM + ':' +
        PAYER_ACCOUNT + ':' + md5(config.perfectmoney_passphrase).toUpperCase() + ':' +
        TIMESTAMPGMT;

    const hash = md5(string).toUpperCase();

    // console.log('hash', V2_HASH, hash);

    if (hash == V2_HASH) {

        MemberTransaction.update({ _id: PAYMENT_ID }, { $set: { status: true }}, (err, success) => {
            if (err) return res.send(err);
            return res.json({
                success: true,
                message: `${success.nModified} thông tin đã được sửa.`
            });
        });
    }

});

module.exports = router;