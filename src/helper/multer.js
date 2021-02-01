const multer = require('multer');
var path = require('path');

//file upload 
module.exports = upload = multer({
    storage: Storage
}).single('file');

var Storage = multer.diskStorage({
    destination: "public/upload",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})