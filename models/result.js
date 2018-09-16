const mongoose = require('mongoose');

var resultDataSchema = new mongoose.Schema({
    day: String,
    month: String,
    year: String,
    result: String,
    ketqua: [],
    lottery_loto: [],
    date: {
        type: String,
        index: { unique: true }
    },
    created: Date,
    updated: Date,
}, { collection: 'results' });

module.exports = mongoose.model('Result', resultDataSchema);