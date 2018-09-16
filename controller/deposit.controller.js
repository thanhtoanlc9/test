const MemberTransaction = require('mongoose').model('MemberTransaction');

const moment = require('moment-timezone');

exports.showDeposit = async(req, res, next) => {
    try {

        const query = req.query;

        let startDate = moment().tz("Asia/Jakarta").subtract(30, 'days').toISOString();
        let endDate = moment().tz("Asia/Jakarta").toISOString();

        if (query.start) {
            startDate = moment(query.start, 'DD/MM/YYYY').tz("Asia/Jakarta").toISOString();
        }

        if (query.end) {
            endDate = moment(query.end, 'DD/MM/YYYY').tz("Asia/Jakarta").toISOString();
        }

        let searchQuery = {
            'type': 'recharge',
            'data.type': {$in: ["perfectmoney", "mobile_card", "card"]},
            'created': startDate !== endDate ? {
                $gte: startDate,
                $lte: endDate
            } : {
            	$gte: startDate
            }
        };

        const data = await MemberTransaction.find(searchQuery).exec();

        res.json(data);

    } catch (err) {
        next(err);
    }
}