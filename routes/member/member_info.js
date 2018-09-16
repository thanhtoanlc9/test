var Member = require('mongoose').model('Member');

const merge = require('lodash/merge');
const repeat = require('lodash/repeat');

module.exports = (req, res) => {

    const member = req.member;
    const lengthphone = member.phone ? member.phone.length: 10;
    const subStr = member.phone.substring(lengthphone-3);
    const secphone = repeat('*',lengthphone-3);
    return res.json({
        email: member.email,
        fullname: member.fullname,
        phone: secphone +subStr,
        username: member.username,
        total_money_member: req.total_money_member
    });

};
