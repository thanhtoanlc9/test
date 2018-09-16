const Result = require('mongoose').model('Result');


module.exports = async (req, res, next) => {
    const list_result_lastest = await Result.findOne({}).sort({ $natural: -1 }).exec();
    if (list_result_lastest == null || (list_result_lastest.ketqua && list_result_lastest.ketqua.length == 0)) {
        return res.json({
            success: false,
            message: 'Bảng kết quả trống'
        });
    }
    req.latest_result = list_result_lastest;
    return next();
}
