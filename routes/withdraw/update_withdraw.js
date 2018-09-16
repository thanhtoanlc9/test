const WithDraw = require('mongoose').model('WithDraw');

function validateWithdrawForm(payload) {

    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.bank_name !== 'string' || payload.bank_name.trim().length === 0 || !isNaN(parseInt(payload.bank_name))) {
        isFormValid = false;
        errors.bank_name = 'Hãy cung cấp tên ngân hàng.';
    }

    if (!payload || typeof payload.bank_number !== 'string' || payload.bank_number.trim().length === 0) {
        isFormValid = false;
        errors.bank_number = 'Hãy cung cấp số tài khoản của bạn.';
    }

    if (!payload || typeof payload.bank_location !== 'string' || payload.bank_location.trim().length === 0 || !isNaN(parseInt(payload.bank_location))) {
        isFormValid = false;
        errors.bank_location = 'Hãy cung cấp chi nhánh ngân hàng.';
    }

    if (!payload || typeof payload.status !== 'boolean') {
        isFormValid = false;
        errors.status = 'Xảy ra vấn đề với thông tin hoàn thành giao dịch.';
    }

    if (!isFormValid) {
        message = 'Xảy ra sự cố với thông tin bạn cung cấp.';
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}


module.exports = (req, res) => {
    req.body.status = (req.body.status == "true")? true : false;
    const validationResult = validateWithdrawForm(req.body);

    if (!validationResult.success) {
        return res.json({
            success: false,
            message: validationResult.message,
            errors: validationResult.errors
        });
    }
    
    const { _id } = req.body;

    WithDraw.update({ _id: _id }, req.body, { upsert: false, multi: false }, (err, success) => {
        if (err) return res.send(err);
        return res.json({
            success: true,
            message: `${success.nModified} thông tin đã được sửa.` 
        });
    });

};