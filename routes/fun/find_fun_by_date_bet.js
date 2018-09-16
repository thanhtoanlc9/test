const Fun = require('mongoose').model('Fun');
const date = require('../../helpers/time');

const {SPECIAL_PRIZE, FIRST_PRIZE, SECOND_PRIZE} = require('../../config/prize.json');

module.exports = async (req, res, next) => {

    const dateBet = date.getDateBet().format('DD-MM-YYYY').toString();

    const fun = await Fun.findOne({date: dateBet}).exec();

    req.fun = fun;
    if (!fun) {
        const funLastest = await Fun.findOne({}, null, {sort: {seation: -1}}).exec();
        const valueFun = !funLastest ? {
            seation: 0,
            special_prize: parseInt(SPECIAL_PRIZE),
            first_prize: parseInt(FIRST_PRIZE),
            second_prize: parseInt(SECOND_PRIZE),
            date: dateBet,
            created: new Date(),
            data: {
              count_special: 0,
              count_first: 0,
              count_second: 0,
            },
            status: 1
        } : {
            seation: funLastest.seation + 1,
            special_prize: funLastest.special_prize,
            first_prize: funLastest.first_prize,
            second_prize: funLastest.second_prize,
            date: dateBet,
            created: new Date(),
            data: funLastest.data,
            status: 1
        };;
        const fun_save = new Fun(valueFun);
        const data = await fun_save.save();
        req.fun = data;
        return next();
    } else {
        return next();
    }
    return next();
}
