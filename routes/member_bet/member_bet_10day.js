var express = require('express');

var router = express.Router();

const MemberBet = require('mongoose').model('MemberBet');

const date = require('../../helpers/time');

// Get bets info of member
router.get('/', function (req, res, next) {
    
    let date_info = new Date();
    
    date_info.setDate(date_info.getDate() - 10);

    let dates = date.formatDate(date_info);

    var list_count_member_10day = [];

    var count_member = MemberBet.aggregate([
        {
            $match: {
                date: dates
            }
        },
        {
            $group: {
                _id: "$date",
                count: { $sum: 1 }
            }
        }
    ]).exec( (err, list) => {
        if (list[0] == null) {
            list[0] = {
                "_id": dates,
                "count": 0
            };
        }

        list_count_member_10day.push(list[0]);
        //console.log(list_count_member_10day);
    });
    // console.log(count_member);
    //console.log(list_count_member_10day);
    //const dem = countMember('29-08-2017');
    /*let dem;
    MemberBet.aggregate([
        {
            $match: {
                date: "30-08-2017"
            }
        },
        {
            $group: {
                _id: "$date",
                count: { $sum: 1 }
            }
        }
    ]).exec( (err, list) => {
        dem = list;
    });
    console.log(dem);
    return ;*/

    /*var list_count_member_10day = [];
    
    for (var i = 10; i >= 1; i--) {
        
        let dates = date.formatDate(date_info);
        MemberBet.aggregate([
            {
                $match: {
                    date: date
                }
            },
            {
                $group: {
                    _id: "$date",
                    count: { $sum: 1 }
                }
            }
        ]).exec( (err, list) => {
            if (list == null) {
                list = [{
                    "_id": dates,
                    count: 0
                }];
            }
            list_count_member_10day.push(list[0]);
            console.log("ds", list_count_member_10day);
        });

    }*/
    // console.log("list count",list_count_member_10day);

});

module.exports = router;
