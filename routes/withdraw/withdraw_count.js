const WithDraw = require('mongoose').model('WithDraw');

// Count all bet in collection
module.exports = (req, res, next) => {

	const { _id } = req.member;
	
    WithDraw.find({member_id: _id}).count((err, count) => {

        if (err) return res.send(err);

        req.withdraw_count = count;
        
        return next();
    });

}