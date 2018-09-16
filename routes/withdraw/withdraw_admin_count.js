const WithDraw = require('mongoose').model('WithDraw');

// Count all bet in collection
module.exports = (req, res, next) => {
	
    WithDraw.find({}).count((err, count) => {

        if (err) return res.send(err);

        req.withdraw_admin_count = count;
        
        return next();
    });

}