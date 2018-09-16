const nodemailer = require('nodemailer');

const config = require('../config/email.json');

const Member = require('mongoose').model('Member');

const crypto = require('crypto');

exports.forgotPassword = async(req, res, next) => {

    try {
        const { email } = req.body;

        // const hostname = req.protocol + '://' + req.get('host');
        const hostname = process.env.SITE_URL || "http://localhost:3000";

        // Find member
        const member = await Member.findOne({ email: email }).exec();

        if (!member) {
            return res.json({
                success: false,
                error: true,
                message: 'không tìm thấy email của bạn trong danh sách thành viên.'
            });
        }

        // Create use verify code
        const user_verify_code = await crypto.randomBytes(20).toString('hex');

        const url_reset = `${hostname}/forgot-password/${member._id}/${user_verify_code}`;

        // Use Smtp Protocol to send Email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: config.gmail_email,
                pass: config.gmail_password
            }
        });

        const html = `<table cellpadding="0" cellspacing="0" border="0" dir="LTR" style="background-color:#f0f7fc;border:1px solid #a5cae4;border-radius:5px;direction:LTR">
                    <tbody>
                        <tr>
                            <td style="background-color:#d7edfc;padding:5px 10px;border-bottom:1px solid #a5cae4;border-top-left-radius:4px;border-top-right-radius:4px;font-family:'Trebuchet MS',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.231">
                                <a href="${hostname}" style="color:#176093;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=vi&amp;q=${hostname}&amp;source=gmail&amp;ust=1505475002955000&amp;usg=AFQjCNHnSk8qoq-dALBLz-C68bh4m3v4iQ">Xien5.com</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#fcfcff;padding:1em;color:#141414;font-family:'Trebuchet MS',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.231">
                                <p style="margin-top:0">${member.fullname}, để đặt lại mật khẩu của bạn tại <a href="${hostname}" style="color:#176093;text-decoration:none" target="_blank">Xien5.com</a>, bạn cần phải bấm vào liên kết bên dưới.</p>
                                <h2 style="font-size:18pt;font-weight:normal;margin:10px 0"><a href="${url_reset}" style="color:#176093;text-decoration:none" target="_blank">Đặt lại mật khẩu</a></h2>
                                <div style="color:#176093;font-size:10px;margin:10px 0"><a href="${url_reset}" style="color:#176093;text-decoration:none" target="_blank">${url_reset}</a></div>
                                <p>Nếu bạn không yêu cầu việc này, bạn có thể thoải mái bỏ qua thư này.</p>
                                <p>Cám ơn.
                                    <br> Xien5.com
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#f0f7fc;padding:5px 10px;border-top:1px solid #d7edfc;border-bottom-left-radius:4px;border-bottom-right-radius:4px;text-align:right;font-family:'Trebuchet MS',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.231">
                                <a href="${hostname}" style="color:#176093;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?hl=vi&amp;q=${hostname}&amp;source=gmail&amp;ust=1505475002955000&amp;usg=AFQjCNHnSk8qoq-dALBLz-C68bh4m3v4iQ">${hostname}</a>
                            </td>
                        </tr>
                    </tbody>
                </table>`;

        transporter.sendMail({
            from: config.gmail_email,
            to: email,
            subject: 'Xác nhận đặt lại mật khẩu',
            html: html,
        }, (err, info) => {

            if (err) {
                return res.json({
                    success: false,
                    error: true,
                    message: 'Lỗi không gửi được email cho bạn.'
                });
            }

            Member.findByIdAndUpdate(member._id, { $set: { user_verify_code: user_verify_code } }, { new: false }, (err, user) => {
                if (err) return res.json(err);

                res.json({
                    success: true,
                    message: 'Yêu cầu thiết lập lại mật khẩu đã được gửi tới email của bạn. Vui lòng làm theo hướng dẫn trong email bạn nhận được. Trân trọng!',
                    user: {
                        id: user._id
                    }
                });

            });

        });

    } catch (err) {
        next(err);
    }

}

exports.changePassword = (req, res, next) => {
    // Todo: Find user with token

    const { password, id, user_verify_code } = req.body;

    Member.findById(id, (err, member) => {

        if (err) {
            return res.json({
                error: true,
                success: false,
                message: 'Không thay đổi được mật khẩu của bạn.'
            });
        }

        if (user_verify_code !== member.user_verify_code) {
            return res.json({
                error: true,
                success: false,
                message: 'Mã xác nhận thay đổi của bạn không đúng.'
            });
        }

        member.set({ password: password, user_verify_code: '' });

        member.save((err, updateMember) => {

            if (err) {
                return res.json({
                    error: true,
                    success: false,
                    message: 'Không thay đổi được mật khẩu của bạn.'
                });
            }

            return res.json({
                success: true,
                message: "Mật khẩu của bạn đã được thay đổi thành công"
            });
        })

    });

}