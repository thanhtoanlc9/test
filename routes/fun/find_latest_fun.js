const Fun = require('mongoose').model('Fun');
const date = require('../../helpers/time');

const {SPECIAL_PRIZE, FIRST_PRIZE, SECOND_PRIZE} = require('../../config/prize.json');

module.exports = (req, res, next) => {
    Fun.findOne({}, {}, { sort: { 'created': -1 } }, function(err, fun) {
    	if (err) return res.send(err);
        req.fun = fun;

    	if (fun == null) {

    		const { amount } = req.body;

            var newFun = new Fun({
                seation: 0,
                special_prize: parseInt(SPECIAL_PRIZE),
                first_prize: parseInt(FIRST_PRIZE),
                second_prize: parseInt(SECOND_PRIZE),
                date: date.formatDate(date.getDateBet()),
                created: new Date(),
                data: {
                    count_special: 0,
                    count_first: 0,
                    count_second: 0,
                },
                status: 1
            });

    		newFun.save((err, new_fun) => {
    			if (err) return res.send(err);
    			req.fun = new_fun;
    			return next();
    		});

    	} else {
    		return next();
    	}

    });
}