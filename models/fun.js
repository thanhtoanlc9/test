const mongoose = require('mongoose');

const {SPECIAL_PRIZE, FIRST_PRIZE, SECOND_PRIZE} =  require('../config/prize.json');

var funDataSchema = new mongoose.Schema({
    seation: {
        type: Number,
        index: true
    },
    special_prize: {
        type: Number,
        default: parseInt(SPECIAL_PRIZE)
    },
    first_prize: {
        type: Number,
        default: parseInt(FIRST_PRIZE)
    },
    second_prize: {
        type: Number,
        default: parseInt(SECOND_PRIZE)
    },
    status: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now()
    },
    data: {
        count_special: {type: Number, default: 0},
        count_first: {type: Number, default: 0},
        count_second: {type: Number, default: 0},
    }

}, { collection: 'funs' });

module.exports = mongoose.model('Fun', funDataSchema);