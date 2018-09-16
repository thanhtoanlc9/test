const Fun = require('mongoose').model('Fun');

const date = require('../../helpers/time');

exports.update = async(req, res, next) => {
    try {
    	let fun = req.fun;
    } catch (err) {
        next(err);
    }
}