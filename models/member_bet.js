const mongoose = require('mongoose');

var memberBetDataSchema = new mongoose.Schema({
    member_id: String,
    member_username: String,
    member_fullname: String,
    date: String,
    day: String,
    month: String,
    year: String,
    created: { type: Date, default: Date.now() },
    bets: [],
    amount: Number,
    updated: Date,
    status: { type: Number, default: 0 },
    bet_mark: { type: Number, default: 0 }

}, { collection: 'member_bets' });

module.exports = mongoose.model('MemberBet', memberBetDataSchema);