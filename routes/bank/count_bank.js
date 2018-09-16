const Bank = require('mongoose').model('Bank');

// Count all bet in collection
module.exports = (req, res, next) => {

    Bank.find({}).count((err, count) => {

        if (err) res.send(err);

        req.bank_count = count;

        next();
    });

}