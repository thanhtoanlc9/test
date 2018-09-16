const router = require('express').Router();

var https = require('https');

var querystring = require('querystring');

const config = require('../config/nganluong');

const split = require('lodash/split');

const zipObject = require('lodash/zipObject');

const merge = require('lodash/merge');

const MemberTransaction = require('mongoose').model('MemberTransaction');

const md5 = require('md5');

const merchant_password = md5(config.data.merchant_id + '|' + config.data.merchant_password);

const axios = require('axios');

const date = require('../helpers/time');

const cards = {
    '10000': 8000,
    '20000': 16000,
    '50000': 40000,
    '100000': 81000,
    '200000': 164000,
    '500000': 425000
}

router.post('/', function(req, res, next) {

    const { _id, fullname, email, phone } = req.member;

    const payload = req.body;

    const data = merge(config.data, payload, {
        'merchant_password': merchant_password,
        'ref_code': _id.toString(),
        'client_fullname': fullname,
        'client_email': email,
        'client_mobile': phone,
    });

    const postData = querystring.stringify(data);

    const options = merge(config.options, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    });

    const request = https.request(options, (response) => {

        // console.log('statusCode:', response.statusCode);
        // console.log('headers:', response.headers);

        response.on('data', (d) => {

            const data = split(d.toString(), "|");

            const key = [
                "error_code",
                "merchant_id",
                "merchant_account",
                "pin_card",
                "card_serial",
                "type_card",
                "ref_code",
                "client_fullname",
                "client_email",
                "client_ mobile",
                "card_amount",
                "transaction_amount",
                "transaction_id"
            ];

            const result = zipObject(key, data);

            if (result.error_code == "00") {

                new MemberTransaction({
                    member_id: _id,
                    member_username: req.member.username,
                    transaction: `Nạp thẻ ${payload.text} ${result.card_amount}đ. Và tài khoản được công ${result.transaction_amount} điểm`,
                    currency: 'VND',
                    // amount: result.transaction_amount,
                    amount: cards[result.card_amount],
                    type: "recharge",
                    status: true,
                    created: new Date(),
                    date: date.todayDate(),
                    data: [{
                        type: "mobile_card",
                        type_card: req.body.type_card,
                        text: req.body.text,
                        code_card: req.body.pin_card,
                        card_serial: req.body.card_serial
                    }]

                }).save((err) => {
                    if (err) res.send(err);
                });
            }

            return res.json({
                success: true,
                error_code: result.error_code,
                c: result.error_code == "00" ? "alert-success" : "alert-danger",
                message: config.errors[result.error_code]
            });

        });

    });

    request.on('error', (e) => {
        res.json({
            success: false,
            message: `problem with request: ${e.message}`
        });
    });

    // write data to request body
    request.write(postData);
    request.end();

});

module.exports = router;