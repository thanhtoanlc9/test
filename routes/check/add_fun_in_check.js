var express = require('express');
var router = express.Router();

const Fun = require('mongoose').model('Fun');

const date = require('../../helpers/time');

const moment = require('moment-timezone');

const {SPECIAL_PRIZE, FIRST_PRIZE, SECOND_PRIZE} = require('../../config/prize.json');

module.exports = async(req, res, next) => {

    const { fun } = req;
    const { date } = fun;
    const mextDay = moment(date, 'DD-MM-YYYY').tz("Asia/Jakarta").add(1, 'days').format('DD-MM-YYYY').toString();

    let special_money = fun.special_prize,
        first_money = fun.first_prize,
        second_money = fun.second_prize;
        
    if (req.countMemberWin[5]) {
        special_money = parseInt(SPECIAL_PRIZE);
        first_money = parseInt(FIRST_PRIZE);
        second_money = parseInt(SECOND_PRIZE);
    } else if (req.countMemberWin[4]) {
        first_money = parseInt(FIRST_PRIZE);
        second_money = parseInt(SECOND_PRIZE);
    } else if (req.countMemberWin[3]) {
        second_money = parseInt(SECOND_PRIZE);
    }

    const count_special = req.countMemberWin[5];
    const count_first = req.countMemberWin[4];
    const count_second = req.countMemberWin[3];

    const results = {
        seation: req.fun.seation + 1,
        special_prize: special_money,
        first_prize: first_money,
        second_prize: second_money,
        date: mextDay,
        created: new Date(),
        data: {
            count_special: count_special,
            count_first: count_first,
            count_second: count_second,
        }
    };

    const newFun = await Fun.update({ date: mextDay }, results, { upsert: true }).exec();

    return res.json(newFun);

};