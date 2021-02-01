const nodemailer = require("nodemailer");
const { callbackPromise } = require("nodemailer/lib/shared");

class SendEmail{
    //send mail
    async mail(useremail) {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'shubham.7.10.1999@gmail.com',
                pass: '8126855405'
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Shubham Sharma" <shubham.7.10.1999@gmail.com>', // sender address
            to: useremail, // list of receivers
            subject: "This is a mail through nodeMailer", // Subject line
            text: "http://localhost:5000/reset_password/" + useremail, // plain text body
        });

        console.log("Message sent successfully");
    }
}

module.exports = SendEmail;