const Image = require('../models/image')
const {uploadToCloudinary} = require('../helper/coudinaryHelper');
const cloudinary = require('../config/cloudinary'   )

const uploadImageController = async (req,res) => {
    try {
        // if file is missing
        if(!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image'
            })
        }

        //  upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file.path);

        // store the imageUrl and publicId along with uploaded userId in database
        const newlyuploadedImage = new Image({
            url,
            publicId,
            uploadedby: req.userInfo.userId
        })

        await newlyuploadedImage.save();

        // delete the image from local storage
        // fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newlyuploadedImage
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong !'
        })
    }
}



const fetchImagesController = async (req,res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (currentPage - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder= req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images) {
            res.status(200).json({
                success: true,
                currentPage: currentPage,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

// delete image controller
const deleteImageController = async (req,res) => {
    try {
      const getCurrentIdOfImageToBeDeleted = req.params.id;
      const userId = req.userInfo.userId;

      const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

      if(!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found !'
        })
      }

      // check if this image is uploaded by the current user who is trying to delete this image
      if(image.uploadedby.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorize to delete this image !'
        })
      }

    //   delete first from cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);

    // delete this image from mongodb database
    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

    res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
    })

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Something went wrong !'
      })
    }
}

module.exports = {uploadImageController ,fetchImagesController, deleteImageController}