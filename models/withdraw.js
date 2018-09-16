const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);

var withdrawDataSchema = new mongoose.Schema({
    member_id: { type: String, maxlength: 50 },
    member_username: { type: String, maxlength: 40 },
    amount: Number,
    bank_name: String,
    bank_number: String,
    bank_location: String,
    created: {type:Date, default: Date.now()},
    status: { type: Boolean, default: true },
    success: {type: Boolean, default: false}

}, { collection: 'withdraws' });

module.exports = mongoose.model('WithDraw', withdrawDataSchema);