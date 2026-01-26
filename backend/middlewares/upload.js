const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, '..', 'uploads', 'products');
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
});

module.exports = upload;
