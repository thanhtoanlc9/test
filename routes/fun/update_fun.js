
const Fun = require('mongoose').model('Fun');

module.exports = async (req, res, next) => {

    let fun = req.fun;
    const { amount } = req.body;

    const special_prize = amount * 0.5;
    const first_prize = amount * 0.03;
    const second_prize = amount * 0.01;

    fun.special_prize += special_prize;
    fun.first_prize += first_prize;
    fun.second_prize += second_prize;

    await fun.save();
    return next();
}
