var moment = require('moment-timezone');

exports.todayDate = function() {
    return moment().tz("Asia/Jakarta").format('DD-MM-YYYY').toString();
}

exports.todayDay = function() {
    return moment().tz("Asia/Jakarta").format('DD').toString();
}

exports.todayMonth = function() {
    return moment().tz("Asia/Jakarta").format('MM').toString();
}

exports.todayYear = function() {
    return moment().tz("Asia/Jakarta").format('YYYY').toString();
}

exports.formatDate = function(date) {
    if (!date) return 'None';
    return moment.tz(date, 'Asia/Jakarta').format('DD-MM-YYYY');
}

exports.formatDateTime = function(date) {
    if (!date) return 'None';
    return moment.tz(date, 'Asia/Jakarta').format('DD-MM-YYYY HH:mm');
}

exports.getTimestamp = function(date) {
    if (!date) {
        return moment().tz("Asia/Jakarta").format('X');
    }
    return moment(date, 'HH:mm DD-MM-YYYY').tz("Asia/Jakarta").format('X');
}

exports.getDateBet = function() {
    let eventNow = moment().tz("Asia/Jakarta");

    if (eventNow.hour() >= 19 && eventNow.hour() <= 24) {
        eventNow.add(1, 'day');
    }

    return eventNow;
}