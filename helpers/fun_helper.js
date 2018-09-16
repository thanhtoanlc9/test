const Fun = require('mongoose').model('Fun');

const {SPECIAL_PRIZE, FIRST_PRIZE, SECOND_PRIZE} =  require('../config/prize.json');

exports.create = async (special = SPECIAL_PRIZE, first = FIRST_PRIZE, second = SECOND_PRIZE) => {

};