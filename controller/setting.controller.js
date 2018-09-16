const Setting = require('mongoose').model('Setting');
const keys = require('lodash/keys');

exports.setting = async(req, res, next) => {

    const data = req.body;

    const keySettings = keys(data);

    const dataSave = keySettings.map(key => {
        return {
            key: key,
            value: data[key]
        }
    });

    try {

        // Step 1: Remove all setting
        const statusDelete = await Setting.remove({}).exec();

        if (statusDelete.error) {
            next(statusDelete.message);
        }

        // Step 2: Save setting
        const statusSave = await Setting.create(dataSave);

        if (statusSave.error) {
            next(statusSave.message);
        }

        res.json({
            success: true,
            data: statusSave,
            message: "Tạo thông tin thành công"
        });

    } catch (err) {
        next(err);
    }

};


exports.getSettings = async(req, res, next) => {
    try {
        const settings = await Setting.find({});
        res.json(settings);
    } catch (err) {
        next(err);
    }
}