const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "vipstore/products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

module.exports = storage;
