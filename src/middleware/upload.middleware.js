const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`),
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.test(ext)) return cb(new Error('Only image files are allowed'), false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });

function uploadSingle(fieldName) {
  return upload.single(fieldName);
}

module.exports = { uploadSingle };
