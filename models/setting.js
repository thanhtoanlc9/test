const mongoose = require('mongoose');

var settingDataSchema = new mongoose.Schema({
    key: { type: String, index: { unique: true, dropDups: true } },
    value: String,

}, { collection: 'settings' });

module.exports = mongoose.model('Setting', settingDataSchema);