const mongoose = require('mongoose');

var cardDataSchema = new mongoose.Schema({
    code_card: { type: String, maxlength: 40 },
    card_serial: { type: String, maxlength: 40 },
    card_type: String,
    amount: Number,
    created: {type:Date, default: Date.now()},
    status: { type: Boolean, default: false }

}, { collection: 'cards' });

module.exports = mongoose.model('Card', cardDataSchema);