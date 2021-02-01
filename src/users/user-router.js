const express = require('express');
const router = express.Router();
const user = require('./user-controller');                          //User class
const obj = new user;
const { check, validationResult } = require('express-validator')
const Validate = require('./validator');                            //Validator class
const validateObj = new Validate;
const { Twilio, getOTP } = require('../helper/twilio');                         //Twilio class
const twilioObj = new Twilio;
const CSV = require('../helper/CSV');                               //CSV class 
const CSVobj = new CSV;
const PDF = require('../helper/createPDF');                         //CreatePdf class
const PDFobj = new PDF;
//const multer = require('../helper/multer');                       
const multer = require('multer');
var path = require('path');

//creating html to pdf
router.get('/pdf', PDFobj.createPdf, (req, res) => {
    res.status(200).download('views/html-To-pdf.pdf');
});

//exporting csv
router.get('/exportcsv', async (req, res) => {
    try {
        await CSVobj.exportCSV();
        res.status(200).download('export.csv'); 
    } catch (error) {
        console.log(error);
    }
});

//importing csv
router.get('/importcsv', CSVobj.importCSV, async (req, res) => {
    res.status(200).send('CSV imported sucessfully');
});

//get user form
router.route('/adduser').get((req, res) => {
    try {
        res.status(200).render('add-user');
    } catch (error) {
        res.status(404).send(error)                 //not found
    }
})

var Storage = multer.diskStorage({
    destination: "public/upload",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})


//file upload 
var upload = multer({ storage: Storage }).single('file');

//register user details
router.route('/adduser').post(upload, validateObj.checkValidate(), validateObj.showErrors, async (req, res) => {
    try {
        let phone = req.body.phone;
        let otp = getOTP();                    //getting OTP
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
            res.status(200).render('add-user', { msg: 'Email already exist, Please try again!' });
        } else {
            res.status(401).redirect('/otpForm/' + req.body.email);     //unauthorized
        }
    } catch (error) {
        console.log(error);
    }
});

//render dashboard
router.route('/').get(async (req, res) => {
    try {
        const total = await obj.countUsers();            //total number of users
        res.status(200).render('dashboard', { total: total.count });
    } catch (error) {
        res.status(404).send(error);                     //not found
    }
});

//list all users
router.route('/list').get(async (req, res) => {
    try {
        let data = await obj.listUsers();
        res.render('section', { title: "All Users Details", details: data, msg: req.flash('message') });
    } catch (error) {
        res.status(501).send(error);                        //not implemented
    }
});

//render users page
router.route('/salary').get((req, res) => {
    try {
        res.render('salary_tab');
    } catch (error) {
        res.status(404).send(error);                            //not found
    }
})

//display users with their salaries
router.route('/salaries').get(async (req, res) => {
    try {
        let result = await obj.displaySalaries();
        res.render('salary_table', { title: "Users Salary", details: result });
    } catch (error) {
        res.status(501).send(error);                            //not implemented
    }
});

//get edit user form
router.route('/edit/:id').get(async (req, res) => {
    let userid = req.params.id;
    let user = await obj.getUserData(userid);
    if (user) {
        let details = user[0];
        res.status(200).render('edit-user', { data: details });
    } else {
        res.status(404).send('Error in rendering user data');       //not found
    }
})

//save user details
router.route('/edit/:id').post(obj.editUserData, async (req, res) => {
    //editUserData(req.body.id);
})

//delete user
router.route('/delete/:id').get(async (req, res) => {
    let id = req.params.id;
    let data = obj.deleteUser(id);
    if (data) {
        res.status(200).redirect('/list');
    } else {
        res.statud(501).send('Error in deleting data');             //not implemented
    }
})

//render OTPform
router.route('/otpForm/:email').get((req, res) => {
    try {
        res.status(200).render('otp-form', { msg: 'Please check your phone for OTP' });
    } catch (error) {
        res.status(404).send(error);                        //not found
    }
});

//submit OTP
router.route('/otpForm/:email').post(twilioObj.verifyOTP, (req, res) => {
    req.flash('message', 'Your account and phone number verified successfully');
    res.status(200).redirect('/list');
});

module.exports = router;