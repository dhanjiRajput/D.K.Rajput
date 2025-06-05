const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileName=`${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
});

const uploads = multer({storage:storage});
module.exports = uploads;