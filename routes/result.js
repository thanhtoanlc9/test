const Result = require('mongoose').model('Result');
const date = require('../helpers/time');

// var cheerio = require('cheerio');

let allDocumentCount = Result.find({});

let allDocument = Result.find({});

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

    Result.findById(id, function(err, result) {
        if (err) return res.send(err);
        return res.json(result);
    });

};

exports.getLatest = function(req, res) {

    let query = {};

    if (req.query.date) {
        query = {
            date: req.query.date
        }
    }

    Result.findOne(query).sort({ $natural: -1 }).exec(function(err, data) {
        if (err) return res.send(err);

        if (!data) {
            return res.json({
                ketqua: [],
                date: req.query.date,
                lottery_loto: []
            });
        }

        const { result, date, lottery_loto, ketqua } = data;

        // const $ = cheerio.load(result);

        // let index = 1;

        // let ketqua = [];
        // let giai = {
        //     giai: '',
        //     xs: []
        // };

        // $('tbody tr').each((i, tr) => {

        //     if (i == 3 || i == 6) {
        //         index = 0;
        //     } else {
        //         index = 1;
        //     }

        //     $(tr).find('td').each((_i, td) => {
        //         if (_i == 0) {
        //             giai.giai = $(td).text() !== "" ? $(td).text() : giai.giai;
        //         } else {
        //             giai.xs.push($(td).text());
        //         }
        //     });

        //     if (index) {
        //         ketqua.push(giai);
        //         giai = {
        //             giai: '',
        //             xs: []
        //         };
        //     }

        // });

        return res.json({
            ketqua: ketqua,
            date: date,
            lottery_loto: lottery_loto
        });

    });

};

exports.update = function(req, res) {

    const { id } = req.params;

    Result.update({ _id: id }, req.body, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.`
        });
    });

};

exports.delete = function(req, res) {

    const { id } = req.params;

    Result.findByIdAndRemove(id).exec(function(err, success) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Xóa thông tin thành công"
        });
    });

};

exports.create = function(req, res) {

    var data = new Result(req.body);
    var create_date = new Date();

    data.created = create_date;
    data.updated = create_date;
    data.save(function(err, success) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Tạo thông tin thành công"
        });
    });

};