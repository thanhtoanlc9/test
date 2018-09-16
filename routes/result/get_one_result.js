var express = require('express');
var router = express.Router();

const Result = require('mongoose').model('Result');

// Get bets info of member
router.get('/', function(req, res, next) {

    Result.findOne().sort({ created: -1 }).exec((err, result) => {
        
        if (err) res.send(err);

        // console.log(result);
        
        req.result = result; 
        
        next();
    });

});

module.exports = router;
