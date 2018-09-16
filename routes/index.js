var express = require('express');

// var index = require('./routes/index');
// var users = require('./routes/users');
// var crawl = require('./routes/crawl');
var user = require('./user');
var result = require('./result');
var member = require('./member');
var blog = require('./blog');
var memberTransaction = require('./member_transaction');
var withdraw = require('./withdraw');
var bank = require('./bank');
var member_bet = require('./member_bet');
var fun = require('./func');
var card= require('./card');
var bcrypt = require('bcrypt');
const SettingController = require('../controller/setting.controller.js');
const DepositController = require('../controller/deposit.controller.js');

// create our router
var router = express.Router();

// on routes that end in /results
// ----------------------------------------------------
router.route('/results')

	// create a result (accessed at POST http://localhost:9999/api/results)
	.post(result.create)

	// get all the results (accessed at GET http://localhost:9999/api/results)
	.get(result.getAll)

// on routes that end in /results/:id
// ----------------------------------------------------
router.route('/results/:id')

	// get an result with that id
	.get(result.get)

	// update the result with this id
	.put(result.update)

	// delete the result with this id
	.delete(result.delete);

//user
router.route('/users')

	// create a user (accessed at POST http://localhost:9999/api/results)
	.post(user.create)

	// get all the users (accessed at GET http://localhost:9999/api/results)
	.get(user.getAll);


// on routes that end in /results/:id
// ----------------------------------------------------
router.route('/users/:id')

	// get an user with that id
	.get(user.get)

	// update the user with this id
	.put(user.update)

	// delete the user with this id
	.delete(user.delete);

router.route('/bcrypt/:pass')
	.get((req, res) => {

		if (!req.params.pass) res.send("No pass");

		bcrypt.hash(req.params.pass, 10, function(err, hash) {
		  if (err) res.send(err);
		  res.send(hash); 
		});
	});

//member
router.route('/members')

	// create a member (accessed at POST http://localhost:9999/api/members)
	.post(member.create)
	
	// get all the results (accessed at GET http://localhost:9999/api/members)
	.get(member.getAll);


// on members that end in /members/:id
// ----------------------------------------------------
router.route('/members/:id')

	// get an member with that id
	.get(member.get)

	// update the member with this id
	.put(member.update)

	// delete the member with this id
	.delete(member.delete);
//blog
router.route('/blogs')

	// create a blog (accessed at POST http://localhost:9999/api/blogs)
	.post(blog.create)

	// get all the results (accessed at GET http://localhost:9999/api/blogs)
	.get(blog.getAll);


// on blogs that end in /results/:id
// ----------------------------------------------------
router.route('/blogs/:id')

	// get an blog with that id
	.get(blog.get)

	// update the blog with this id
	.put(blog.update)

	// delete the blog with this id
	.delete(blog.delete);

//member_transaction
router.route('/member_transactions')

	// create a member_transaction (accessed at POST http://localhost:9999/api/member_transactions)
	.post(memberTransaction.create)

	// get all the member_transactions (accessed at GET http://localhost:9999/api/member_transactions)
	.get(memberTransaction.getAll);


// on member_transactions that end in /member_transactions/:id
// ----------------------------------------------------
router.route('/member_transactions/:id')

	// get an member_transaction with that id
	.get(memberTransaction.getMember)

	// update the member_transaction with this id
	.put(memberTransaction.update)

	// delete the member_transaction with this id
	.delete(memberTransaction.delete);

//withdraw
router.route('/withdraws').get(withdraw.getAll);

router.route('/withdraw-edit/:id').put(withdraw.update);


//bank
router.route('/banks')

	// create a bank (accessed at POST http://localhost:9999/api/banks)
	.post(bank.create)

	// get all the banks (accessed at GET http://localhost:9999/api/banks)
	.get(bank.getAll);


// on banks that end in /banks/:id
// ----------------------------------------------------
router.route('/banks/:id')

	// get an bank with that id
	.get(bank.get)

	// update the bank with this id
	.put(bank.update)

	// delete the bank with this id
	.delete(bank.delete);

//member_bet
router.route('/member_bets')

	// create a member_bet (accessed at POST http://localhost:9999/api/member_bets)
	.post(member_bet.getListToday)

	// get all the member_bets (accessed at GET http://localhost:9999/api/member_bets)
	.get(member_bet.getAll)

	.patch(member_bet.info)

	// get info the member_bets (accessed at PUT http://localhost:9999/api/member_bets)
	.put(member_bet.getTotal);


// on member_bet that end in /member_bets/:id
// ----------------------------------------------------
router.route('/member_bets/:id')

	// get an member_bet with that id
	.get(member_bet.get)

	// update the member_bet with this id
	.put(member_bet.update)

	// delete the member_bet with this id
	.delete(member_bet.delete);

//fun
router.route('/funs').get(fun.getAll);

router.route('/funs/:id').delete(fun.delete);

router.use('/withdraw-list', 
    require('./member_transaction/transaction_withdraw_count.js'),
    require('./member_transaction/transaction_withdraw_list.js')
);

router.route('/settings')
	.post(SettingController.setting)
	.get(SettingController.getSettings);

router.put('/update-profile/:id', require('./member/update_profile.js'));

//card
router.route('/cards')

	// create a card (accessed at POST http://localhost:9999/api/cards)
	.post(card.create)

	// get all the cards (accessed at GET http://localhost:9999/api/cards)
	.get(card.getAll);


// on cards that end in /cards/:id
// ----------------------------------------------------
router.route('/cards/:id')

	// get an card with that id
	.get(card.get)

	// update the card with this id
	.put(card.update)

	// delete the card with this id
	.delete(card.delete);


router.route('/deposit').get(DepositController.showDeposit);


module.exports = router;
