var express = require('express');
var member_bet = require('./member_bet');
var fun = require('./func');
var result = require('./result');
var blog = require('./blog');
var card = require('./card');

const BlogController = require('../controller/blog.controller.js');
const ForgotPasswordController = require('../controller/forgot_password.controller.js');
const EmailBetdController = require('../controller/email_bet.controller.js');
const SettingController = require('../controller/setting.controller.js');
const Test = require('../controller/deposit.controller.js');

// create our router
var router = express.Router();

// on bet that end in /bet
// ----------------------------------------------------

// get newest result

router.use('/result', require('./result/get_one_result.js'));

// get member bet today
router.use('/member-bet',
    require('./member_bet/member_bet_count_injoin_today.js'),
    require('./member_bet/member_bet_injoin_today.js'));

// Get latest prize
router.route('/latest-prize').get(member_bet.getListNewPrize);

// Get member bet today
router.use('/member-bet-today',
    require('./member_bet/member_bet_total_money_today.js'),
    require('./member_bet/member_bet_count_today.js'),
    require('./member_bet/member_bet_today.js')
);

// Get count member bet today
router.route('/count-amout-member-bet-today').get(member_bet.getTotal);

// Get member prize latest
router.use('/member-prize-latest',
  require('./result/latest_result.js'),
  require('./fun/find_fun_by_date_home.js'),
  require('./member_bet/member_bet_prize.js')
);
// check winner in today
router.use('/checkwin',
    require('./result/latest_result.js'),
    require('./check/member_bet_update.js'),
    require('./fun/find_fun_by_date_home.js'),
    require('./member_bet/member_bet_prize_today.js'),
    require('./check/update_transaction_in_check.js'),
    require('./check/add_fun_in_check.js')
);

// get func
router.route('/fun').get(fun.get);

// Get latest result
router.route('/result-latest').get(result.getLatest);

router.use('/perfect-money', require('./perfect_money.js'));

// Get blog
router.route('/blog/:seo_url').get(blog.getDetail);

// get blog list
router.route('/blog-list').get(BlogController.getBlogList);

// get 10 day
router.use('/member-10day',
    require('./fun/find_fun_by_date.js'),
    require('./member_bet/member_bet_10day.js')
);

router.use('/member-prize-date',
    require('./fun/find_fun_by_date.js'),
    require('./member_bet/member_bet_prize_dashboard.js')
);

// Forget password
router.route('/forgot-password')
    .post(ForgotPasswordController.forgotPassword)
    .put(ForgotPasswordController.changePassword);

router.route('/send-email').get(EmailBetdController.sendEmailMemberBet);

router.route('/settings').get(SettingController.getSettings);

//bo sung

router.use('/recharge_today',
    require('./member_transaction/transaction_recharge_today_count.js'),
    require('./member_transaction/transaction_recharge_today_list.js')
);

router.use('/recharge_list_admin',
    require('./member_transaction/recharge_count_dashboard.js'),
    require('./member_transaction/recharge_dashboard_list.js')
);

router.use('/withdraw_list_admin',
    require('./member_transaction/withdraw_count_dashboard.js'),
    require('./member_transaction/withdraw_dashboard_list.js')
);

// get card count
router.route('/count_card').get(card.count);

// For test

router.route('/test').get(Test.showDeposit);

module.exports = router;
