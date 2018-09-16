const MemberBet = require('mongoose').model('MemberBet');

const groupBy = require('lodash/groupBy');
const merge = require('lodash/merge');
const join = require('lodash/join');

module.exports = async (req, res) => {

    const textPrize = ['Giải năm', 'Giải tư', 'Giải ba', 'Giải nhì', 'Giải nhất', 'Giải đặc biệt'];

    const classPrize = {
        5: 'font-size-16 font-weight-700 theme-color',
        4: 'font-size-16 font-weight-700',
        3: 'color-3'
    }
    const { fun, latest_result } = req;

    const { date } = latest_result;

    const funAmount = {
        3: fun.second_prize,
        4: fun.first_prize + fun.second_prize,
        5: fun.special_prize + fun.first_prize + fun.second_prize
    };

    const count_special = await MemberBet.find({ bet_mark: 5, date: date, status: 1 }).count();

    const count_first = await MemberBet.find({ bet_mark: 4, date: date, status: 1 }).count();

    const find_member = {   bet_mark: 3,
                            date: date,
                            status: 1
                        };

    if (count_special !== 0 ) {

        find_member.bet_mark = 5;

    } else {

        find_member.bet_mark = (count_first!== 0)? 4 : 3;
    }

    MemberBet.find(find_member).sort({ bet_mark: -1 }).exec((err, results) => {
        if (err) res.send(err);
        const groupByPrize = merge({ 3: [], 4: [], 5: [] }, groupBy(results, result => result.bet_mark));

        const newResult = results.map( result => {

            let countPrize = groupByPrize[result.bet_mark].length;

            if (countPrize == 0) {
                countPrize = 1;
            }

            let amount_net = ( funAmount[result.bet_mark] / countPrize );

            return {
                _id: result._id,
                username: result.member_username,
                amount_net: amount_net,
                class: classPrize[result.bet_mark],
                prize_text: textPrize[result.bet_mark],
                bets: join(result.bets, ', ')
            };
        });

        res.json(newResult);
    });
};
