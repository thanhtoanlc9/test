var express = require('express');
var router = express.Router();

var request = require('request');
//var cheerio = require('cheerio');
const date = require('../helpers/time');

const Member_bet = require('mongoose').model('MemberBet');
const MemberTransaction = require('mongoose').model('MemberTransaction');
const Result = require('mongoose').model('Result');
const Fun = require('mongoose').model('Fun');


const includes = require('lodash/includes');

const today = date.todayDate();

router.get('/', function(req, res, next) {

    // Todo: check result
    Result.findOne({ 'date': today }, 'lottery_loto', (err, result) => {
        if (err) res.send(err);

        if (!result) {
            return res.json('Can\' fond result');
        }

        const { lottery_loto } = result;

        Member_bet.find({ 'date': today }, '_id bets', (err, members) => {

            if (err) res.send(err);

            let createFun = 0;

            members.forEach(member => {

                const { _id, bets } = member;

                let bet_mark = 0;

                for (var i = 0; i < bets.length; i++) {
                    if (includes(lottery_loto, bets[i])) {
                        bet_mark++;
                    }
                }

                if (bet_mark == 5) {
                    createFun = 1;
                }

                Member_bet.findByIdAndUpdate( _id, { $set: { 'status': 1, 'bet_mark': bet_mark } }, function(err, updated) {

                    // console.log(_id, bet_mark, updated);

                });

            });

            if (createFun) {
                Fun.findOne({}, null, { sort: { seation: -1 } }, function(err, data) {
                    if (err) {
                        return res.json(err);
                    }

                    const seation = (data == null) ? 1 : data.seation + 1;
                    const d = date.getDateBet();
                    var list = {
                        seation: seation,
                        date: date.formatDate(d),
                        data:{
                            count_special: 0,
                            count_first: 0,
                            count_second: 0
                        }
                    }

                    new Fun(list).exec(function(err) {
                        if (err) return res.json(err);
                        console.log('Create new seation.');
                    });

                });
            }

            res.json({message: '1'});

        });

    });

});

module.exports = router;