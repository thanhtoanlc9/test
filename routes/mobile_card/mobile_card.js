const router = require('express').Router();

var https = require('https');

var querystring = require('querystring');

const config = require('../../config/nganluong');

const split = require('lodash/split');

const zipObject = require('lodash/zipObject');

const merge = require('lodash/merge');

const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    const data = merge(config.data, payload, req.dataclient);
    
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

            const result = zipObject(req.key, data);

            if (result.error_code == "00") {
                // todo: insert transaction to database
               return next();

            }

            return res.json({
                success: true,
                error_code: result.error_code,
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

    return;

};
