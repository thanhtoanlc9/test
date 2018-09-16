const Fun = require('mongoose').model('Fun');

module.exports = async (req, res, next) => {

    const {date} = req.latest_result;

    Fun.findOne({ date: date }, {}, function(err, fun) {
        
        if (err) return res.send(err);
        
        if (fun === null) {
            fun = {
                special_prize: 0,
                first_prize: 0,
                second_prize: 0
            };

        }
        req.fun = fun;
        return next();
    });

}