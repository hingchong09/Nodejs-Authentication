const multer = require('multer');
const path = require('path');

// set our multer storage

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'uploads/')
    },
    filename: function(req,file,cb) {
        // file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName); // Fixed missing cb() call
    }
});

// file filter function
const checkFilter = (req,file,cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null , true);
    }else {
        cb(new Error ('Not an image ! Upload only images'), false)
    }
}


// multer middleware
module.exports = multer({
    storage: storage,
    fileFilter: checkFilter,
    limits: {
        fileSize:  5 * 1024 *1024 // 5mb file size limit
    }
})