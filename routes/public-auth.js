var express = require('express');

// create our router
var router = express.Router();

const WithdrawController = require('../controller/withdraw.controller.js');

const SettingController = require('../controller/setting.controller.js');

var card = require('./card');

// Member bet
router.use('/bet',
    // Check time
    require('./member_bet/member_bet_time.js'),
    // Check fun member
    require('./member_transaction/count_fun_member.js'),
    // Create bet
    require('./member_bet/member_bet_create.js'),
    // Get latest fun
    require('./fun/find_fun_by_date_bet.js'),
    // Update fun
    require('./fun/update_fun.js'),
    // Update transaction
    require('./member_transaction/add_transaction.js'),
    // Final result
    (req, res) => {
        return res.json({
            success: true,
            message: "Bet successfuly"
        });
    }
);


// Get bet history of member
router.use('/member-bet-history',
    // Count all best of member
    require('./member_bet/member_bet_count_history.js'),
    // Get history of member
    require('./member_bet/member_bet_history.js')
);

router.use('/member-info',
    require('./member_transaction/count_fun_member.js'),
    require('./member/member_info.js'),
);

router.use('/member-transaction',
    require('./member_transaction/count_member_transaction.js'),
    require('./member_transaction/transaction_list.js')
);

router.use('/member-rechage-transaction',
    require('./member_transaction/count_recharge_transaction.js'),
    require('./member_transaction/transaction_list_recharge.js')
);

router.route('/withdraws')
    .post(WithdrawController.withdraw);

router.route('/settings').post(SettingController.setting);


// Mobile Card
router.use('/mobile_card', require('./mobile_card.js'));

// Perfect Money
router.use('/perfect-money', require('./perfect_money.js'));

router.use('/bank',
    require('./bank/count_bank.js'),
    require('./bank/list_bank.js')
);

router.use('/bank-list',require('./bank/bank_home.js'));

router.post('/create-bank', require('./bank/create_bank.js'));

router.use('/withdraw-list-member', 
    require('./member_transaction/member_transaction_withdraw_count.js'),
    require('./member_transaction/member_transaction_withdraw_list.js')
);

// get card count
router.route('/count_card').get(card.count);

module.exports = router;