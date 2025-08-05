const jwt = require("jsonwebtoken");
const renderError = require("../utils/renderError");

exports.authCheck = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware สำหรับตรวจสอบสิทธิ์ admin
exports.adminCheck = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "ต้องเข้าสู่ระบบก่อน",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "ไม่มีสิทธิ์เข้าถึง - ต้องเป็น admin เท่านั้น",
      });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
    });
  }
};

// Middleware สำหรับตรวจสอบสิทธิ์ business หรือ admin
exports.businessCheck = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "ต้องเข้าสู่ระบบก่อน",
      });
    }

    if (req.user.role !== "BUSINESS" && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "ไม่มีสิทธิ์เข้าถึง - ต้องเป็นผู้ประกอบการหรือ admin เท่านั้น",
      });
    }

    next();
  } catch (error) {
    console.error("Business check error:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์",
    });
  }
};
