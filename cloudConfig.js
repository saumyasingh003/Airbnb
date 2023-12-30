const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Assuming you are using version 3

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY, // Corrected the variable name
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'airbnb_DEV',
    allowed_formats: ["jpg", "png", "jpeg","webp"], // Corrected the parameter name
  },
});

module.exports = { cloudinary, storage };
