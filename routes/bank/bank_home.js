var express = require('express');
var router = express.Router();

const Bank = require('mongoose').model('Bank');

// Get bets info of member
router.get('/', function(req, res, next) {

    Bank.find({}).sort({ created: -1 }).exec((err, results) => {
        
        if (err) res.send(err);

        res.json({data: results});

    });

});

module.exports = router;
