const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    const {date} = req.query;

    MemberTransaction.find({date: date, type: 'win'}).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);

        res.json(results);

    });

};