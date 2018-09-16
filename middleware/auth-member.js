const jwt = require('jsonwebtoken');
const Member = require('mongoose').model('Member');
const config = require('../config');


/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {

    if (!req.headers.authorization) {
        return res.send({ error: true });
    }

    // get the last part from a authorization header string like "bearer token-value"
    const token = req.headers.authorization;

    // decode the token using a secret key-phrase
    return jwt.verify(token, config.jwtSecret, (err, decoded) => {
        // the 401 code is for unauthorized status
        if (err) { return res.status(401).end(); }

        const {_id} = decoded;

        // check if a user exists
        return Member.findById(_id, (userErr, member) => {
            if (userErr || !member) {
                return res.status(401).end();
            }

            req.member = member;

            return next();
        });
    });
};