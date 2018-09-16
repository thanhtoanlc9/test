const Fun = require('mongoose').model('Fun');

const date = require('../../helpers/time');

module.exports = (req, res, next) => {

    const { amount } = req.body;
    
    var d = date.getDateBet();

    const special_prize = amount * 0.5;
    const first_prize = amount * 0.03;
    const second_prize = amount * 0.01;
    const data = {
        count_special: 0,
        count_first: 0,
        count_second: 0
    };

    var fun = {};
    fun.special_prize += special_prize;
    fun.first_prize += first_prize;
    fun.second_prize += second_prize;
    fun.date = date.formatDate(d);
    fun.created = new Date();
    fun.data = data;
    
    let fun_save = new Fun(fun);
    
    fun_save.save((err) => {

        if (err) res.send(err);

        return next();

    });

}