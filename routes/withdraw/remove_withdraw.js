const WithDraw = require('mongoose').model('WithDraw');


// Delete withdraw
module.exports = (req, res, next) => {

    const { _id } = req.body;
    WithDraw.findByIdAndRemove(_id).exec(function(err) {
        
        if (err) return res.send(err);
        
        return next();
    });
    

}