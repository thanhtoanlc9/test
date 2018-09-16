const mongoose = require('mongoose');

var MemberTransactionDataSchema = new mongoose.Schema({

    member_id: String,
    member_username: String,
    transaction: String,
    currency: String,
    amount: Number,
    date: String,
    created: { 
        type: Date, 
        default: new Date() 
    },
    type: String,
    status: {
    	type: Boolean,
    	default: false
    },
    data:{}

}, { collection: 'member_transactions' });

MemberTransactionDataSchema.index({ type: 'text' });

module.exports = mongoose.model('MemberTransaction', MemberTransactionDataSchema);