const date = require('../../helpers/time');

var moment = require('moment-timezone');

module.exports = (req, res, next) => {

	var curentTime = moment().tz("Asia/Jakarta").hours();

	// if ( 18 <= curentTime && curentTime < 19) {
	if ( curentTime === 18 ) {
	    return res.json({ success: false, message: 'Bạn không thể chơi trong khoảng thời gian 18h đến 19h.' });
	} else {
		next();
	}

}