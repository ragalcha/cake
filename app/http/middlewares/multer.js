const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure public/temp directory exists
const tempDir = path.join(__dirname, "../../../public/temp");
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      console.log("Destination path:", tempDir); // Log the path
      cb(null, tempDir);
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, and JPG files are allowed"));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = { upload };
