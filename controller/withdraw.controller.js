const MemberTransaction = require('mongoose').model('MemberTransaction');
const Card = require('mongoose').model('Card');

const axios = require('axios');

const capcha = require('../config/capcha');

const date = require('../helpers/time');

exports.withdraw = async (req, res, next) => {

    const { _id, username } = req.member;
    const phoneUser = req.member.phone;
    const { type, g_recaptcha_response, phone} = req.body;
    var { amount } = req.body;
    const data = {};
    var card = null;
    try {

        // Step 1: Check data input
        //const check = check(amount, bank_name, bank_number, bank_location);

        if (isNaN(amount)) {

            throw new Error("Hãy nhập số tiền rút là số .");

        }

        if (phone !== phoneUser) {
            throw new Error("Số điện thoại không đúng");
        }

        // Step 2: Caculator total money of member
        const totalMoneyOfMember = await MemberTransaction.aggregate([{
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
        ]).exec();
        if (totalMoneyOfMember.length <= 0) {
            throw new Error("Bạn không có đủ tiền trong tài khoản .");
        }

        if (type == "bank") {
            if (amount <= 500000 || amount > totalMoneyOfMember[0].total) {
                throw new Error("Số tiền bạn muốn rút phải lớn hơn 500000đ và nhỏ hơn số tiền hiện có trong tài khoản của bạn.");
            }

            const { bank_name, bank_number, bank_location, bank_username} = req.body;

            data.type = "bank";
            data.bank_name = bank_name;
            data.bank_number = bank_number;
            data.bank_location = bank_location;
            data.bank_username = bank_username,
            data.status = false;


        } else if (type == "mobile_card") {
            if (amount > totalMoneyOfMember[0].total
                || (parseInt(amount) != 10000
                    && parseInt(amount) != 20000
                    && parseInt(amount) != 50000
                    && parseInt(amount) != 100000
                    && parseInt(amount) != 200000
                    && parseInt(amount) != 500000)) {
                throw new Error("Số tiền bạn rút phải nhỏ hơn số tiền hiện giờ bạn đang có và có các mệnh giá là 10, 20, 50, 100, 200 hoặc 500. .");
            }

            const { type_card, text } = req.body;
            if (type_card === null
                || text === null
                || type_card === ''
                || text === '') {
                throw new Error("Bạn chưa chọn loại thẻ . ");
            }

            card = await Card.findOne({amount: parseInt(amount), card_type: req.body.text, status: false}).exec();

            if (card === null) {
                throw new Error('Hiện tại trong kho thẻ hết thẻ mệnh giá này! Xin vui lòng chọn loại thẻ khác.');
            }
            data.code_card = card.code_card;
            data.card_serial = card.card_serial;
            data.status = true;
            data.update = new Date();
            data.type = "mobile_card";
            data.type_card = type_card;
            data.text = text;
        } else if(type == "perfectmoney") {

            if (amount < 5 || (amount * 22750) > totalMoneyOfMember[0].total) {
                throw new Error("Số tiền bạn muốn rút phải lớn hơn 5$ và nhỏ hơn số tiền hiện có trong tài khoản của bạn.");
            }
            const {payee_account, description} = req.body;
            data.type = type;
            data.amount = parseInt(amount);
            data.payee_account = payee_account;
            data.phone = phone;
            data.description = description;
            data.status = false;

        } else {
            throw new Error("Bạn đã thay đổi giá trị biến type truyền vào.");
        }

        if (g_recaptcha_response === undefined || g_recaptcha_response === '' || g_recaptcha_response === null) {
            throw new Error('Hãy thực hiện captcha.');
        } else {
            const remoteip = req.connection.remoteAddress
            const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + capcha.secretKey + "&response=" + g_recaptcha_response + "&remoteip=" + remoteip;

            const fetchData = await axios.get(verificationUrl);

            const data = await fetchData.data;

            if (data.success !== undefined && !data.success) {
                throw new Error('Quá trình kiểm tra captcha đã xảy ra sự cố.');
            }
        }

        // Step 3: Save transaction

        const saveMemberTransaction = new MemberTransaction({
            member_id: _id,
            member_username: username,
            amount: -parseInt(amount),
            transaction: `Withdraw ` + amount,
            date: date.todayDate(),
            currency: 'VND',
            type: "withdraw",
            status: true,
            created: new Date(),
            data: data
        });

        const m = await saveMemberTransaction.save();
        if (m.data.type == "mobile_card") {
            Card.update({ _id: card._id }, {status: true}, { upsert: false, multi: false }).exec();

        }
        return res.json({
            success: true,
            message: "Bạn đã rút tiền thành công! Hãy vào xem thông tin Lịch sử rút tiền trong Hồ sơ cá nhân"
        });
    } catch (err) {
        next(err);
    }

}
