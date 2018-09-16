const Member_bet = require('mongoose').model('MemberBet');

const Member = require('mongoose').model('Member');

const Fun = require('mongoose').model('Fun');

const Result = require('mongoose').model('Result');

const jwt = require('jsonwebtoken');

const date = require('../helpers/time');

const config = require('../config');

const {SPECIAL_PRIZE, FIRST_PRIZE, SECOND_PRIZE} = require('../config/prize.json');

String.prototype.isNumber = function() { return /^\d+$/.test(this); };

let allDocumentCount = Member_bet.find({});

let allDocument = Member_bet.find({});

exports.getAll = function(req, res) {

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    allDocument.limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);

        allDocumentCount.count((err, count) => {

            if (err) res.send(err);

            res.json({
                data: results,
                count: count,
                limit: limit,
                skip: skip
            });
        })

    });

};

exports.get = function(req, res) {

    const { id } = req.params;
    Member_bet.findById(id, function(err, result) {

        if (err) return res.send(err);

        return res.json(result);
    });

};

// get member injoin today
exports.getListToday = function(req, res) {

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    Member_bet.find({ date: date.todayDate() }).limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);

        Member_bet.find({ date: date.todayDate() }).count((err, count) => {

            if (err) res.send(err);

            res.json({
                data: results,
                count: count,
                limit: limit,
                skip: skip
            });
        })
    });

};

// member win
exports.getListNewPrize = function(req, res) {

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    Result.findOne({}).sort({ $created: -1 }).exec((err, data) => {
        if (err) {
            res.send(err);
        }

        Member_bet.find({ bet_mark: { $gt: 2 }, date: data.date, status: 1 }).limit(limit).skip(skip).sort({ bet_mark: -1, created: -1 }).exec((err, results) => {
            if (err) res.send(err);
            res.json(results);
        });
    });

};

// count member win
exports.getListCount = function(req, res) {

    Result.findOne().sort({ created: -1 }).exec((err_result, data_result) => {

        if (err_result) return res.send(err_result);

        Member_bet.aggregate([{
                $match: {
                    bet_mark: { $gte: 3 },
                    date: data_result.date
                }
            },
            {
                $group: {
                    _id: "$bet_mark",
                    total: { $sum: 1 }
                }
            }
        ]).exec((err, data) => {
            if (err) return res.send(err);
            return res.json(data);
        });
    });

};

// total money players today
exports.getTotal = function(req, res) {

    Member_bet.aggregate([{
            $match: {
                date: date.todayDate(),
            }
        },
        {
            $group: {
                _id: 'tongtien',
                total: { $sum: "$amount" }
            }
        }
    ]).exec((err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

};

exports.update = function(req, res) {

    const member = req.body;

    member.update = new Date();

    const { id } = req.params;

    Member_bet.update({ _id: id }, member, { upsert: false, multi: false }, (err, success) => {

        if (err) return res.send(err);

        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.`
        });

    });

};

exports.delete = function(req, res) {

    const { id } = req.params;

    Member_bet.findByIdAndRemove(id).exec(function(err) {

        if (err) return res.send(err);

        return res.json({
            success: true,
            message: "Xóa thông tin thành công"
        });

    });

};

exports.create = function(req, res) {

    var time = parseInt(date.getTimestamp());

    var time_s = parseInt(date.getTimestamp('17:00 ' + date.todayDate()));

    var time_f = parseInt(date.getTimestamp('20:00 ' + date.todayDate()));

    // Todo: uncomment when release production

    // if (time >= time_s && time <= time_f) {
    //     return res.json({ success: false, message: 'From 5:00 pm to 8:00 pm must not bet.' });

    // }

    const member = req.member

    const { bets } = req.body;

    var data = new Member_bet({
        member_id: member._id,
        member_username: member.username,
        member_fullname: member.fullname,
        day: date.todayDay(),
        month: date.todayMonth(),
        year: date.todayYear(),
        date: date.todayDate(),
        created: new Date(),
        bets: bets,
        amount: 10000,
        status: 0,
        check: null
    });

    data.save(function(err) {

        if (err) return res.send(err);

        Fun.findOne({}, {}, { sort: { 'created': -1 } }, function(err, fun) {

            if (err) return;

            const ticket = 10000;

            const special_prize = ticket * 0.5;
            const first_prize = ticket * 0.03;
            const second_prize = ticket * 0.01;

            if (err == null && fun == null) {
                // init fun
                new Fun({
                    seation: 0,
                    special_prize: (parseInt(SPECIAL_PRIZE) + special_prize),
                    first_prize: (parseInt(FIRST_PRIZE) + first_prize),
                    second_prize: (parseInt(SECOND_PRIZE) + second_prize),
                    status: 1
                }).save();

                return;
            }

            fun.special_prize += special_prize;
            fun.first_prize += first_prize;
            fun.second_prize += second_prize;

            fun.save((err) => {

                if (err) res.send(err);

                return res.json({
                    success: true,
                    message: "Đặt cược thành công"
                });
            });

        });
    });

};

exports.info = function(req, res) {

    const { condition } = req.body;

    let { limit, skip } = req.query;

    limit = (limit === undefined) ? 5 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    Member_bet.find(condition).limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);

        Member_bet.find(condition).count((err, count) => {

            if (err) res.send(err);

            res.json({
                data: results,
                count: count,
                limit: limit,
                skip: skip
            });
        })
    });
}