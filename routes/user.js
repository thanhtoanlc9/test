const User = require('mongoose').model('User');

const validator = require('validator');

let allDocumentCount = User.find({});

let allDocument = User.find({});

function validateLoginForm(payload) {

  // console.log('payload', payload);

  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0|| !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Hãy cung cấp email của bạn.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Hãy cung cấp mật khẩu của bạn.';
  }

  if (!isFormValid) {
    message = 'Xảy ra sự cố với thông tin được cung cấp.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

exports.getAll = function(req, res) {
   
    let { limit, skip } = req.query;

    limit = (limit === undefined)? 5 : parseInt(limit);

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

    User.findById(id, function(err, result) {
        if (err) return res.send(err);
        return res.json(result);
    });

};

exports.update = function(req, res) {

    const validationResult = validateLoginForm(req.body);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    const {id} = req.params;

    User.update({ _id: id }, req.body, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.`
        });
    });

};

exports.delete = function(req, res) {
     
    const {id} = req.params;

    User.findByIdAndRemove(id).exec(function(err){
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Xóa thông tin thành công"
        });
    });
    
};

exports.create = function(req, res) {

    const validationResult = validateLoginForm(req.body);
    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    } 
    let user = req.body;
    user.created = new Date();
    var data = new User(req.body);

    data.save(function(err) {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: "Tạo thông tin thành công"
        });
    });

};
