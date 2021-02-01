const { check, validationResult } = require('express-validator')

class Validate{
    showErrors(req,res,next){
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            next();
        }else{
            let alert = errors.array();
            let data = req.body;
            res.render('add-user', { alert, data });
        }    
    } 
    //check add-user inputs
    checkValidate(){
        return [
            check('name', '*Name is required').notEmpty(),
            check('email', '*Email is required').notEmpty().isEmail().withMessage('*Enter a valid email'),
            check('password', '*Password is required').notEmpty().isLength({min:4, max:10}).withMessage('length must be 4 to 10 characters'),
            check('salary', '*Salary is required').notEmpty().isLength({min:4, max:10}).withMessage('length must be 4 to 10 characters'),
            check('phone', '*Phone is required').notEmpty().isLength({min:8, max:10}).withMessage('length must be 8 to 10 characters'),
            check('date', '*Date is required').notEmpty(),
            check('address1', '*Address1 is required').notEmpty(),
            check('address2', '*Address2 is required').notEmpty(),
            check('city', '*City is required').notEmpty(),
            check('state', '*State is required').notEmpty(),
            check('zip', '*Zip is required').notEmpty()
        ]
    }
}

module.exports = Validate;