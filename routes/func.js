var Func = require('mongoose').model('Fun');

const validator = require('validator');

const {SPECIAL_PRIZE, FIRST_PRIZE, SECOND_PRIZE} =  require('../config/prize.json');

let allDocumentCount = Func.find({});

let allDocument = Func.find({});

const date = require('../helpers/time');

exports.getAll = function(req, res) {

    let { limit, skip } = req.query;

    limit = (limit === undefined)? 10 : parseInt(limit);

    skip = (skip === undefined) ? 0 : parseInt(skip);

    allDocument.limit(limit).skip(skip).sort({ created: -1 }).exec((err, results) => {

        if (err) res.send(err);

        allDocumentCount.count( (err, count) => {

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

// get latest fun
exports.get = function(req, res) {
    Func.findOne({}, null, {sort: {seation: -1}}, function(err,data) {
        if (err) {
            return res.send(err);
        }
        if (data === null) {
            var newFun = new Func({
                seation: 0,
                special_prize: parseInt(SPECIAL_PRIZE),
                first_prize: parseInt(FIRST_PRIZE),
                second_prize: parseInt(SECOND_PRIZE),
                date: date.formatDate(date.getDateBet()),
                created: new Date(),
                data: {
                    count_special: 0,
                    count_first: 0,
                    count_second: 0,
                },
                status: 1
            });

            newFun.save((error, new_fun) => {
                if (error) {
                  return res.send(error);
                };
                return res.json(new_fun);
            });
        } else {
            return res.json(data);
        }

    });

};

exports.update = function (req,res) {


    Func.findOne({}, null, {sort: {seation: -1}}, function(err,data){
        if (data == null) {
            return res.json({message: "Không tồn tại dữ liệu cần sửa"});
        }

        var list = {
            special_prize : data.special_prize + 5000,
            first_prize : data.first_prize + 300,
            second_prize : data.second_prize + 100
        }
        console.log(list);
        Func.update({ _id: data._id }, list, { upsert: false, multi: false }, (err, success) => {
            if (err) return res.send(err);
            return res.json({message: `${success.nModified} thông tin đã được sửa.`});
        });
    });

};

exports.delete = function(req, res) {
    const {id} = req.params;
    Func.findByIdAndRemove(id).exec(function(err){
        if (err) return res.send(err);
        return res.json({ message: "Xóa thông tin thành công" });
    });

};

exports.create = function(req, res) {
    const d = date.getDateBet();
    Func.findOne({}, null, {sort: {seation: -1}}, function(err,data){
        if (err) {
            console.log(err);
        }
        const seation = (data == null)? 1 : data.seation+1;
        var list = {
            seation: seation,
            date: date.formatDate(d),
            created: new Date(),
            data: {
                count_special: 0,
                count_first: 0,
                count_second: 0
            }
        }
        var data = new Func(list);
        data.save(function(err) {
            if (err) return res.send(err);
            return res.json({message: "Tạo thông tin thành công"});
        });
    });

};
