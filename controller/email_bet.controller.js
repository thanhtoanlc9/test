const MemberBet = require('mongoose').model('MemberBet');
const Member    = require('mongoose').model('Member');

const date = require('../helpers/time');

const config = require('../config/email.json');

const nodemailer = require('nodemailer');

const isArray = require('lodash/isArray');

exports.sendEmailMemberBet = async (req, res, next) => {

    const todayBet = date.getDateBet().format('DD-MM-YYYY').toString();

    try {

        const map = function () {
            emit(this.member_id, this.bets);
        };

        const reduce = function (key, values) {
            return values.length
        };

        const query = {
            date: todayBet
        };

        const results = await MemberBet.mapReduce({map, reduce, query});

        // Use Smtp Protocol to send Email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: config.gmail_email,
                pass: config.gmail_password
            }
        });

        const memberBets = await MemberBet.find(query).exec();

        let countMemberBets = memberBets.length;

        let htmlBet = '';

        htmlBet += `<table border="1" style="width: 600px; text-align: center;">
                            <thead>
                            <tr>
                                <th width={70} className="text-center">STT</th>
                                <th>Tài khoản thành viên</th>
                                <th>Cặp số</th>
                                <th>Thời gian</th>
                                <th className="text-xs-right p-r-2">Số tiền (VNĐ)</th>
                            </tr>
                            </thead>
                            <tbody>`;

        for (let i = 0; i < countMemberBets; i++) {
            htmlBet += `<tr>
                                        <td className="text-center p-r-2">${i}</td>
                                        <td><b>${memberBets[i].member_username}</b></td>
                                        <td>${memberBets[i].bets.join(', ')}</td>
                                        <td>${date.formatDateTime(memberBets[i].created)}</td>
                                        <td className="text-xs-right p-r-2">${memberBets[i].amount}</td>
                                    </tr>`;
        }


        htmlBet += `</tbody>
                        </table>`;

        await results.forEach(async (result) => {

            let {_id, value} = result;

            const member = await Member.findOne({_id: _id}).exec();

            if (!member) res.end();

            let html = `<p>Chào Bạn: ${member.fullname}</p>`;
            html += 'Các số bet thành viên ngày ' + todayBet;
            html += htmlBet;

            await transporter.sendMail({
                from: config.email,
                to: member.email,
                subject: 'Bet ngày ' + todayBet,
                html: html,
            }, (err, info) => {
                console.error("Send email bet:", info);
            });

        });

        res.json(results);

    } catch (err) {
        next(err);
    }

}