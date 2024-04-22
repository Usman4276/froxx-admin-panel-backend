const multer = require("multer");
const path = require("path");

let maxFileSize = 20000000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + fileExtension);
  },
});

function multerFileFilter(req, file, cb) {
  const fileExtension = path.extname(file.originalname);

  if (
    fileExtension === ".pdf" ||
    fileExtension === ".docx" ||
    fileExtension === ".doc"
  ) {
    return cb(null, true);
  }
  cb(new Error("Only [pdf, docx, doc] files are supported"), false);
}

const upload = multer({
  storage: storage,
  fileFilter: multerFileFilter,
  // limits: { fileSize: maxFileSize },
}).array("attachment");

module.exports = upload;
