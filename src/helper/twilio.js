const { User } = require('../users/user-model');
const { Op } = require("sequelize");
const config = require('../../config');
const twilio = config.env.twilio;
const client = require('twilio')(twilio.accountSid, twilio.authToken);

class Twilio {
    //send otp to user
    async sendOTP(phone, otp) {
        await client.messages
            .create({
                body: `Your OTP is ${otp}`,
                from: '+14343624446',
                to: '+91' + phone
            })
            .then(message => console.log('Message send sucessfully'));
    }

    //verify OTP middleware
    async verifyOTP(req, res, next) {
        let email = req.params.email;
        let otp = req.body.otp;
        try {
            let user = await User.findAll({
                where: {
                    email: {
                        [Op.eq]: email
                    }
                }
            });
            console.log(user);
            if (user) {
                let details = user[0];
                if (details.otp == otp) {
                    await User.update({ status: 1 }, {
                        where: {
                            email: email
                        }
                    }).then((data) => {
                        if (data) {
                            console.log('updated data'+data);
                            next();
                        } else {
                            console.log('No data found');
                        }
                    });
                } else {
                    res.render('otp-form', { msg: 'Wrong OTP please try agian!' })
                }
            } else {
                console.log('No user found');
            }
        } catch (error) {
            console.log(error);
        }
    }
}

//genrate OTP 
function getOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp;
}

module.exports = {Twilio, getOTP};