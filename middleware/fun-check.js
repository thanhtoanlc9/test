const MemberTransaction = require('mongoose').model('MemberTransaction');
const config = require('../config');
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
        return MemberTransaction.find({member_id : _id}, (memErr, list) => {
            if (memErr || !list) {
                return res.status(401).end();
            }

            req.member = member;

            return next();
        });
    });
};