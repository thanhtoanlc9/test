const MemberTransaction = require('mongoose').model('MemberTransaction');

exports.update = function(req, res) {

    const {id} = req.params;
    const {type} = req.body;
    MemberTransaction.findOne({_id: id}).exec( (err, withdraw) => {
    
        if (err) return res.send(err);
        
        let data = withdraw.data;
        if (type !== data.type) {
            return res.json({
                success: false,
                message: `Thông tin về loại rút tiền không trùng nhau.`
            });
        }

        data.status = true;
        
        data.update = new Date();

        MemberTransaction.update({ _id: id }, {data: data}, { upsert: false, multi: false }, (err, success) => {
    
            if (err) return res.send(err);
    
            return res.json({
                success: true,
                message: `${success.nModified} thông tin đã được sửa.`
            });
    
        });
    
    });

};

async function countWithdraw(querySearch) {
    return await MemberTransaction.find(querySearch).count();
}

exports.getAll = async (req, res, next) => {

    try {

        let { limit, skip, search } = req.query;

        limit = (limit === undefined) ? 10 : parseInt(limit);

        skip = (skip === undefined) ? 0 : parseInt(skip);

        let querySearch = null;

        /*if (search) {
            querySearch = merge(querySearch, {
                $text: {
                    $search: search
                }
            })
        }*/
        //querySearch.type = 'withdraw';
        if (search && search !== '') {
            querySearch = {
                type: 'withdraw',
                'data.type' : search
            };
        } else {
            querySearch = {
                type: 'withdraw',
            };
        }
        const count = await countWithdraw(querySearch);
        const results = await MemberTransaction.find(querySearch).limit(limit).skip(skip).sort({ created: -1 }).exec();
        return res.json({
            data: results,
            count: count,
            limit: limit,
            skip: skip
        });

    } catch (err) {
        next(err);
    }
};
