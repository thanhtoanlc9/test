const MemberTransaction = require('mongoose').model('MemberTransaction');

const groupBy = require('lodash/groupBy');

const merge = require('lodash/merge');

module.exports = (req, res, next) => {

    const {date} = req.latest_result;

    MemberTransaction.find({date: date, type: 'win'}).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);
        res.json(results);

    });

};