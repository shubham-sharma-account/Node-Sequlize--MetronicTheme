const express = require('express');
const router = express.Router();
const user = require('./user-controller');                          //User class
const obj = new user;
const { check, validationResult } = require('express-validator')
const Validate = require('./validator');                            //Validator class
const validateObj = new Validate;
const Twilio = require('../helper/twilio');                         //Twilio class
const twilioObj = new Twilio;
const CSV = require('../helper/CSV');                               //CSV class 
const CSVobj = new CSV;
const PDF = require('../helper/createPDF');                         //CreatePdf class
const PDFobj = new PDF;
const multer = require('multer');
var path = require('path');
const { User, UserSalary } = require('../users/user-model');
const pdf = require('html-pdf');
const fs = require('fs');

router.get('/render', async (req, res) => {
    let data = await obj.listUsers();
    res.render('section', { details: data }, (err, output) => {
        if (err) {
            console.log(err);
            res.send(err)
        }
        var options = { format: 'Letter' };

        pdf.create(output, options).toFile('views/html-To-pdf.pdf', function (err, result) {
            if (err) return console.log(err);
            console.log(result);
        });
        res.send(output)
    });
});

//creating html to pdf
router.get('/pdf', async (req, res) => {
    try {
        await PDFobj.createPdf();
        res.download('views/html-To-pdf.pdf');
        console.log('PDF file created successfully');
    } catch (error) {
        console.log(error);
    }
});

//exporting csv
router.get('/exportcsv', async (req, res) => {
    try {
        await CSVobj.exportCSV();
        res.send('CSV file created successfully');
    } catch (error) {
        console.log(error);
    }
});

//importing csv
router.get('/importcsv', async (req, res) => {
    try {
        await CSVobj.importCSV();
        res.send('CSV imported successfully');
    } catch (error) {
        console.log(error);
    }
});

//genrate random OTP
let otp = '';
for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10)
}

//get user form
router.route('/adduser').get(async (req, res) => {
    try {
        await res.render('add-user');
    } catch (error) {
        console.log(error);
    }
})

var Storage = multer.diskStorage({
    destination: "public/upload",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

//file upload 
var upload = multer({
    storage: Storage
}).single('file');

//register user details
router.route('/adduser').post(upload, validateObj.checkValidate(), validateObj.showErrors, async (req, res) => {
    try {
        let phone = req.body.phone;
        twilioObj.sendOTP(phone, otp);
        let myJson = {
            name: req.body.name,
            image: req.file.filename,
            imageurl: req.body.imageurl,
            salary: req.body.salary,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            date: req.body.date,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            otp: otp
        }
        let result = await obj.insert(myJson);
        if (result) {
            res.render('add-user', { msg: 'Email already exist, Please try again!' });
        } else {
            res.redirect('/otpForm/' + req.body.email);
        }
    } catch (error) {
        console.log(error);
    }
});

//render dashboard
router.route('/').get(async (req, res) => {
    try {
        const total = await obj.countUsers();            //total number of users
        res.render('dashboard', { total: total.count });
    } catch (error) {
        console.log(error);
    }
});

//list all users
router.route('/list').get(async (req, res) => {
    try {
        let data = await obj.listUsers();
        res.render('section', { title: "All Users Details", details: data, msg: req.flash('message') });
    } catch (error) {
        console.log(error);
    }
});

//render users page
router.route('/salary').get(async (req, res) => {
    try {
        await res.render('salary_tab');
    } catch (error) {
        console.log(error);
    }
})

//display users with their salaries
router.route('/salaries').get(async (req, res) => {
    try {
        let result = await obj.displaySalaries();
        res.render('salary_table', { title: "Users Salary", details: result });
    } catch (error) {
        console.log(error);
    }
});

//get edit user form
router.route('/edit/:id').get(obj.getUserData, async (req, res) => {
})

//save user details
router.route('/edit/:id').post(obj.editUserData, async (req, res) => {
    //editUserData(req.body.id);
})

//delete user
router.route('/delete/:id').get(async (req, res) => {
    await User.destroy({
        where: {
            id: req.params.id
        }
    }).then((data) => {
        if (data) {
            res.redirect('/list');
        } else {
            res.send('Error in deleting data')
        }
    });
})

//render OTPform
router.route('/otpForm/:email').get((req, res) => {
    try {
        res.render('otp-form', { msg: 'Please check your phone for OTP' });
    } catch (error) {
        console.log(error);
    }
});

//submit OTP
router.route('/otpForm/:email').post(twilioObj.verifyOTP, (req, res) => {
    req.flash('message', 'Your account and phone number verified successfully');
    res.redirect('/list');
});

module.exports = router;