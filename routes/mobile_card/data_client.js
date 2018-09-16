
// data client
module.exports = (req, res, next) => {

    const { _id, fullname, email, phone } = req.member;
    
    const payload = req.body;
    
    var dataclient =  {
        'ref_code': _id.toString(),
        'client_fullname': fullname,
        'client_email': email,
        'client_mobile': phone,
    }
    
    const key = [
                "error_code",
                "merchant_id",
                "merchant_account",
                "pin_card",
                "card_serial",
                "type_card",
                "ref_code",
                "client_fullname",
                "client_email",
                "client_ mobile",
                "card_amount",
                "transaction_amount",
                "transaction_id"
            ];

    req.dataclient = dataclient;
    req.key = key;

    next();
}