const multer = require("multer");
const path = require("path");

// Configure multer for memory storage (เก็บไฟล์ใน memory แทน disk)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // ตรวจสอบว่าเป็นไฟล์รูปภาพหรือไม่
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("ไฟล์ต้องเป็นรูปภาพเท่านั้น"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Multer error handler middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "ขนาดไฟล์เกิน 5MB",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "ไฟล์ไม่ถูกต้อง",
      });
    }
  }

  if (error.message === "ไฟล์ต้องเป็นรูปภาพเท่านั้น") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
};

module.exports = { upload, handleMulterError };
