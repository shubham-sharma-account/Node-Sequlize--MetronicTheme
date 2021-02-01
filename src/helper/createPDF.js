const pdf = require('html-pdf');
const user = require('../users/user-controller');
const obj = new user;

class CreatePdf {
    //genrating pdfFile
    async createPdf(req, res, next) {
        let data = await obj.listUsers();
        res.render('section', { details: data }, (err, output) => {
            if (err) {
                res.status(404).send(err)               //not found
            }
            var options = {
                height: "10.5in",        
                width: "15in",
                base: "file:////home/shubham/Desktop/Metro_theme_firebase/public/stylesheets/bootstrap.min.css",
            };

            pdf.create(output, options).toFile('views/html-To-pdf.pdf', function (err, result) {
                if (err) res.status(501).send('Error in creating PDF filr');       
                console.log(result);
                next();
            });
        });
    }
}

module.exports = CreatePdf;