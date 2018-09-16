const Bank = require('mongoose').model('Bank');

const date = require('../../helpers/time');

// Create a bet
module.exports = (req, res) => {
    let bank = req.body;
   
    bank.created = new Date();
    
    var data = new Bank(bank);

    data.save(function(err, bet) {

        if (err) return res.send(err);
        res.json({
            success: true,
            message: "Tạo ngân hàng(bank) thành công !"
        })
    });

}