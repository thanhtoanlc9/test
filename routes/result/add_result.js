const Result = require('mongoose').model('Result');
const date = require('../../helpers/time');

module.exports = (req, res, next) => {

    const body = req.body;

    const result = Result(req.body);

    var create_date = new Date();

    result.day = date.todayDay();
    result.month = date.todayMonth();
    result.year = date.todayYear();
    result.date = date.todayDate();
    result.created = create_date;
    result.updated = create_date;

    result.save((err, trans) => {
    	if (err) return res.send(err);

    	return next();
    });

}