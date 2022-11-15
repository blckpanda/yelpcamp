const cloudinary = require('cloudinary').v2; 
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOULDINARY_CLOUD_NAME,
    api_key: process.env.CLOULDINARY_KEY,
    api_secret: process.env.CLOULDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'BookCamp',
    allowedFormats: ['jpeg', 'png', 'jpg']
})

module.exports = {
    cloudinary,
    storage
}