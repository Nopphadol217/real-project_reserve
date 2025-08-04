const express = require("express");
const multer = require("multer");
const { authCheck } = require("../middleware/authCheck");
const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// Multer configuration สำหรับอัปโหลดไฟล์
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// ดึงข้อมูลการชำระเงินของผู้ประกอบการ
router.get("/business/info", authCheck, async (req, res) => {
  try {
    const userId = req.user.id;

    const paymentInfo = await prisma.payment.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!paymentInfo) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลการชำระเงิน",
      });
    }

    res.json({
      success: true,
      data: paymentInfo,
    });
  } catch (error) {
    console.error("Error fetching payment info:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
      error: error.message,
    });
  }
});

// สร้างข้อมูลการชำระเงินใหม่
router.post(
  "/business/info",
  authCheck,
  upload.single("qrCode"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { accountName, accountNumber, bankName, promptPayId, notes } =
        req.body;

      // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
      const existingPayment = await prisma.payment.findFirst({
        where: {
          userId: userId,
        },
      });

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: "คุณมีข้อมูลการชำระเงินอยู่แล้ว กรุณาใช้การอัปเดต",
        });
      }

      let qrCodeUrl = null;

      // อัปโหลด QR Code ถ้ามี
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                folder: "payment_qr_codes",
                public_id: `qr_${userId}_${Date.now()}`,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(req.file.buffer);
        });

        qrCodeUrl = result.secure_url;
      }

      // สร้างข้อมูลการชำระเงิน
      const paymentInfo = await prisma.payment.create({
        data: {
          userId,
          accountName,
          accountNumber,
          bankName,
          promptPayId,
          qrCodeUrl,
          notes,
        },
      });

      res.status(201).json({
        success: true,
        message: "สร้างข้อมูลการชำระเงินสำเร็จ",
        data: paymentInfo,
      });
    } catch (error) {
      console.error("Error creating payment info:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการสร้างข้อมูล",
        error: error.message,
      });
    }
  }
);

// อัปเดตข้อมูลการชำระเงิน
router.put(
  "/business/info",
  authCheck,
  upload.single("qrCode"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { accountName, accountNumber, bankName, promptPayId, notes } =
        req.body;

      // ค้นหาข้อมูลเดิม
      const existingPayment = await prisma.payment.findFirst({
        where: {
          userId: userId,
        },
      });

      if (!existingPayment) {
        return res.status(404).json({
          success: false,
          message: "ไม่พบข้อมูลการชำระเงิน",
        });
      }

      let qrCodeUrl = existingPayment.qrCodeUrl;

      // อัปโหลด QR Code ใหม่ถ้ามี
      if (req.file) {
        // ลบ QR Code เดิมจาก Cloudinary ถ้ามี
        if (existingPayment.qrCodeUrl) {
          try {
            const publicId = existingPayment.qrCodeUrl
              .split("/")
              .pop()
              .split(".")[0];
            await cloudinary.uploader.destroy(`payment_qr_codes/${publicId}`);
          } catch (deleteError) {
            console.log("Error deleting old QR code:", deleteError);
          }
        }

        // อัปโหลดไฟล์ใหม่
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                folder: "payment_qr_codes",
                public_id: `qr_${userId}_${Date.now()}`,
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(req.file.buffer);
        });

        qrCodeUrl = result.secure_url;
      }

      // อัปเดตข้อมูล
      const updatedPayment = await prisma.payment.update({
        where: {
          id: existingPayment.id,
        },
        data: {
          accountName,
          accountNumber,
          bankName,
          promptPayId,
          qrCodeUrl,
          notes,
          updatedAt: new Date(),
        },
      });

      res.json({
        success: true,
        message: "อัปเดตข้อมูลการชำระเงินสำเร็จ",
        data: updatedPayment,
      });
    } catch (error) {
      console.error("Error updating payment info:", error);
      res.status(500).json({
        success: false,
        message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
        error: error.message,
      });
    }
  }
);

// ลบข้อมูลการชำระเงิน
router.delete("/business/info", authCheck, async (req, res) => {
  try {
    const userId = req.user.id;

    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!existingPayment) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลการชำระเงิน",
      });
    }

    // ลบ QR Code จาก Cloudinary ถ้ามี
    if (existingPayment.qrCodeUrl) {
      try {
        const publicId = existingPayment.qrCodeUrl
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(`payment_qr_codes/${publicId}`);
      } catch (deleteError) {
        console.log("Error deleting QR code:", deleteError);
      }
    }

    // ลับข้อมูลจากฐานข้อมูล
    await prisma.payment.delete({
      where: {
        id: existingPayment.id,
      },
    });

    res.json({
      success: true,
      message: "ลบข้อมูลการชำระเงินสำเร็จ",
    });
  } catch (error) {
    console.error("Error deleting payment info:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบข้อมูล",
      error: error.message,
    });
  }
});

module.exports = router;
