const cloudinary = require('../config/cloudinary')


const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url : result.secure_url,
            publicId : result.public_id
        }


    } catch (error) {
        console.error('Error while uploading cloudinary',error);
        throw new Error('Error while uploading cloudinary')
    }
}


module.exports = {uploadToCloudinary}