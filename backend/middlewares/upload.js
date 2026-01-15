const multer = require("multer");
const storage = require("../utils/cloudinaryStorage");

const upload = multer({ storage });

module.exports = upload;
