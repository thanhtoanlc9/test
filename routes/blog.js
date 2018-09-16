const Blog = require('mongoose').model('Blog');

let allDocumentCount = Blog.find({});

let allDocument = Blog.find({});

const last = require('lodash/last');
const split = require('lodash/split');

exports.getAll = function(req, res) {

   let { limit, skip } = req.query;

    limit = (limit === undefined)? 1000 : parseInt(limit);

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

exports.get = function(req, res) {

    const {id} = req.params;

    Blog.findById(id, function(err, result) {
        if (err) return res.send(err);
        return res.json(result);
    });

};

exports.getDetail = function(req, res) {

    const {seo_url} = req.params;

    const seo_url_array = split(seo_url, '-');

    Blog.findOne({_id: last(seo_url_array)}, function(err, result) {
        if (err) return res.send(err);
        return res.json(result);
    });

};

exports.update = function(req, res) {

    const {id} = req.params;

    Blog.update({ _id: id }, req.body, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.`
        });
    });

};

exports.delete = function(req, res) {

    const {id} = req.params;

    Blog.findByIdAndRemove(id).exec(function(err){
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Xóa thông tin thành công!"
        });
    });
    
};

exports.create = function(req, res) {

    let blog = req.body;
    
    blog.created = new Date();
    
    var data = new Blog(blog);

    data.save(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Tạo thông tin thành công"
        });
    });

};