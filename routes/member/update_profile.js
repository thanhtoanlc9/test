var Member = require('mongoose').model('Member');

const validator = require('validator');

const bcrypt = require('bcrypt');

function validateMemberForm(payload) {

    const errors = {};
    let isFormValid = true;
    let message = '';
    if (!payload || typeof payload._id !== 'string' || payload._id.trim().length === 0) {
        isFormValid = false;
        errors.id = 'Hãy kiểm tra lại mã thành viên.';
    }

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0 || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Hãy kiểm tra lại email bạn nhập vào.';
    }

    if (!payload || typeof payload.password !== 'string' ||( payload.password !== '' && payload.password.trim().length < 6)) {
        isFormValid = false;
        errors.password = 'Password phải tối đa 6 kí tự.';
    }

    if (payload.confirm_password !== payload.password) {
        isFormValid = false;
        errors.confirm_password = 'Hãy kiểm tra lại Confirm password.';
    }

    if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
        isFormValid = false;
        errors.username = 'Hãy kiểm tra lại tên tài khoản.';
    }

    if (!payload || typeof payload.phone !== 'string' || payload.phone.trim().length < 10 || isNaN(payload.phone)) {
        isFormValid = false;
        errors.phone = 'Hãy kiểm tra lại Số điện thoại(Phone).';
    }

    if (!payload || typeof payload.fullname !== 'string' || payload.fullname.trim().length === 0 || !isNaN(parseInt(payload.fullname))) {
        isFormValid = false;
        errors.fullname = 'Hãy kiểm tra lại Họ tên(Full name).';
    }

    if (!isFormValid) {
        message = 'Xảy ra lỗi thông tin cung cấp.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}


module.exports = async (req, res) => {

    const validationResult = validateMemberForm(req.body);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }

    const { id } = req.params;
    
    var data = {
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone
    };
    
    if (req.body.password !== "") {
        
        const salt = await bcrypt.genSalt();

        const hash = await bcrypt.hash(req.body.password, salt);

        data.password = hash;
    
    }

    Member.update({ _id: id }, data, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({ message: `${success.nModified} thông tin thành viên sửa thành công.` });
    });

};