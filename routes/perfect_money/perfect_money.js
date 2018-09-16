const md5 = require('md5');
const config = require('../../config/perfectmoney');
const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res) => {

    const payload = req.body;

    const {PAYMENT_ID, PAYEE_ACCOUNT, V2_HASH, PAYMENT_AMOUNT, PAYMENT_BATCH_NUM, PAYER_ACCOUNT, TIMESTAMPGMT, PAYMENT_UNITS} = req.body;

    if (!PAYMENT_ID) {
        return res.json({
            success: false
        });
    }

    const string = PAYMENT_ID + ':' + PAYEE_ACCOUNT + ':' +
              PAYMENT_AMOUNT + ':' + PAYMENT_UNITS + ':' + 
              PAYMENT_BATCH_NUM + ':' + 
              PAYER_ACCOUNT + ':' + md5(config.perfectmoney_passphrase).toUpperCase() + ':' +
              TIMESTAMPGMT;

        const hash = md5(string).toUpperCase();
    
    if (hash == V2_HASH) {
        
        return next();
    }

    return res.json({
        success: false
    });


};
