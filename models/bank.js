const mongoose = require('mongoose');

var bankDataSchema = new mongoose.Schema({
	bankname: String,
	name: String,
	created: { type: Date, default: new Date() },
 
},{collection: 'banks'});

module.exports = mongoose.model('Bank',bankDataSchema);