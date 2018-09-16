const MemberTransaction = require('mongoose').model('MemberTransaction');

module.exports = (req, res, next) => {

    const { _id } = req.member;

    MemberTransaction.aggregate([{
            $match: {
                member_id: String(_id),
                status: true
            }
        },
        {
            $group: {
                _id: _id,
                total: { $sum: "$amount" }
            }
        }
    ]).exec((err, data) => {

        if (err) {
          req.total_money_member = 0;
          return next();
        };

        req.total_money_member = (data.length == 0)? 0 : data[0].total;

        return next();

    });

}
