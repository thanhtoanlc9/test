var express = require('express');
var router = express.Router();

const WithDraw = require('mongoose').model('WithDraw');

// Get bets info of member
router.get('/', function(req, res, next) {
    
    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    WithDraw.find({}).limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {
        
        if (err) res.send(err);

        res.json({
            data: results,
            count: req.withdraw_admin_count,
            limit: limit,
            skip: skip
        });

    });


});

module.exports = router;
