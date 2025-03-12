const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const upload = require('../middleware/upload-middleware');
const {uploadImageController, fetchImagesController , deleteImageController} = require('../controllers/image-controller');


// upload image
router.post('/upload', authMiddleware, adminMiddleware, upload.single('image'), uploadImageController);



// get all images 
router.get('/get' , authMiddleware , fetchImagesController);

// delete image route
router.delete('/:id', authMiddleware , adminMiddleware , deleteImageController);










module.exports  = router