const Fun = require('mongoose').model('Fun');

module.exports = (req, res, next) => {

    const { date } = req.query;

    Fun.findOne({ date: date }, {}, function(err, fun) {
        
        if (err) return res.send(err);

        if (fun == null) {
            fun = {};
            fun.special_prize = 0;
            fun.first_prize = 0;
            fun.second_prize = 0;

        }

        req.fun = fun;
        req.date = date;
        return next();

    });
}