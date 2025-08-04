const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;
const { handleError } = require("../middleware/handleError");

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
};

// อัปโหลดข้อมูลการชำระเงิน
const uploadPaymentInfo = async (req, res) => {
  try {
    const { placeId, accountName, bankName, accountNumber } = req.body;
    const userId = req.user.id;

    // ตรวจสอบว่า place เป็นของ user นี้หรือไม่
    const place = await prisma.place.findFirst({
      where: {
        id: parseInt(placeId),
        userId: userId,
      },
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบที่พักหรือคุณไม่มีสิทธิ์เข้าถึง",
      });
    }

    // ตรวจสอบว่ามี QR Code หรือไม่
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "กรุณาอัปโหลด QR Code",
      });
    }

    // อัปโหลด QR Code ไป Cloudinary
    const qrCodeResult = await uploadToCloudinary(req.file.buffer, {
      folder: "payment/qr_codes", // ใช้ folder เฉพาะสำหรับ QR codes
      public_id: `qr_${placeId}_${Date.now()}`,
    });

    // บันทึกข้อมูลลงฐานข้อมูล
    const paymentInfo = await prisma.payment.upsert({
      where: {
        userId_placeId: {
          userId: userId,
          placeId: parseInt(placeId),
        },
      },
      update: {
        accountName,
        bankName,
        accountNumber,
        qrCodeUrl: qrCodeResult.secure_url,
        qrCodePublicId: qrCodeResult.public_id,
      },
      create: {
        userId: userId,
        placeId: parseInt(placeId),
        accountName,
        bankName,
        accountNumber,
        qrCodeUrl: qrCodeResult.secure_url,
        qrCodePublicId: qrCodeResult.public_id,
      },
    });

    res.json({
      success: true,
      message: "บันทึกข้อมูลการชำระเงินสำเร็จ",
      data: paymentInfo,
    });
  } catch (error) {
    console.error("Upload payment info error:", error);
    handleError(res, error);
  }
};

// ดึงข้อมูลการชำระเงิน
const getPaymentInfo = async (req, res) => {
  try {
    const { placeId } = req.params;
    const userId = req.user?.id; // Optional user check

    // ตรวจสอบสิทธิ์เฉพาะถ้ามี user (สำหรับ admin access)
    if (userId) {
      const place = await prisma.place.findFirst({
        where: {
          id: parseInt(placeId),
          userId: userId,
        },
      });

      if (!place) {
        return res.status(404).json({
          success: false,
          message: "ไม่พบที่พักหรือคุณไม่มีสิทธิ์เข้าถึง",
        });
      }
    }

    const paymentInfo = await prisma.payment.findFirst({
      where: { placeId: parseInt(placeId) },
    });

    res.json({
      success: true,
      data: paymentInfo,
    });
  } catch (error) {
    console.error("Get payment info error:", error);
    handleError(res, error);
  }
};

// อัปเดตข้อมูลการชำระเงิน
const updatePaymentInfo = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { accountName, bankName, accountNumber } = req.body;
    const userId = req.user.id;

    // ตรวจสอบสิทธิ์
    const place = await prisma.place.findFirst({
      where: {
        id: parseInt(placeId),
        userId: userId,
      },
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบที่พักหรือคุณไม่มีสิทธิ์เข้าถึง",
      });
    }

    const updateData = {
      accountName,
      bankName,
      accountNumber,
    };

    // ถ้ามี QR Code ใหม่
    if (req.file) {
      // ลบรูปเก่าจาก Cloudinary
      const existingPayment = await prisma.payment.findUnique({
        where: { placeId: parseInt(placeId) },
      });

      if (existingPayment && existingPayment.qrPublicId) {
        await cloudinary.uploader.destroy(existingPayment.qrPublicId);
      }

      // อัปโหลดรูปใหม่
      const qrCodeResult = await uploadToCloudinary(req.file.buffer, {
        folder: "payment_qr_codes",
        public_id: `qr_${placeId}_${Date.now()}`,
      });

      updateData.qrCodeUrl = qrCodeResult.secure_url;
      updateData.qrPublicId = qrCodeResult.public_id;
    }

    const paymentInfo = await prisma.payment.update({
      where: { placeId: parseInt(placeId) },
      data: updateData,
    });

    res.json({
      success: true,
      message: "อัปเดตข้อมูลการชำระเงินสำเร็จ",
      data: paymentInfo,
    });
  } catch (error) {
    console.error("Update payment info error:", error);
    handleError(res, error);
  }
};

// ลบข้อมูลการชำระเงิน
const deletePaymentInfo = async (req, res) => {
  try {
    const { placeId } = req.params;
    const userId = req.user.id;

    // ตรวจสอบสิทธิ์
    const place = await prisma.place.findFirst({
      where: {
        id: parseInt(placeId),
        userId: userId,
      },
    });

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบที่พักหรือคุณไม่มีสิทธิ์เข้าถึง",
      });
    }

    // ลบจาก Cloudinary
    const existingPayment = await prisma.payment.findUnique({
      where: { placeId: parseInt(placeId) },
    });

    if (existingPayment && existingPayment.qrPublicId) {
      await cloudinary.uploader.destroy(existingPayment.qrPublicId);
    }

    // ลบจากฐานข้อมูล
    await prisma.payment.delete({
      where: { placeId: parseInt(placeId) },
    });

    res.json({
      success: true,
      message: "ลบข้อมูลการชำระเงินสำเร็จ",
    });
  } catch (error) {
    console.error("Delete payment info error:", error);
    handleError(res, error);
  }
};

// อัปโหลดสลิปการโอนเงิน (สำหรับลูกค้า)
const uploadPaymentSlip = async (req, res) => {
  try {
    console.log("Upload payment slip request:", {
      params: req.params,
      userId: req.user?.id,
      hasImageData: !!req.body.image,
      imageDataLength: req.body.image ? req.body.image.length : 0,
      bodyKeys: Object.keys(req.body),
    });

    const { bookingId } = req.params;
    const { image } = req.body;
    const userId = req.user.id;

    // ตรวจสอบว่า booking เป็นของ user นี้หรือไม่
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(bookingId),
        userId: userId,
      },
    });

    console.log("Found booking:", booking ? "Yes" : "No");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบการจองหรือคุณไม่มีสิทธิ์เข้าถึง",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "กรุณาอัปโหลดสลิปการโอนเงิน",
      });
    }

    console.log("Starting Cloudinary upload...");

    // อัปโหลดสลิปไป Cloudinary (รับ base64 data เหมือน uploadImageAPI)
    const slipResult = await cloudinary.uploader.upload(image, {
      public_id: `slip_${bookingId}_${Date.now()}`,
      resource_type: "auto",
      folder: "payment/payment_slips",
    });

    console.log("Cloudinary upload result:", slipResult.secure_url);

    // อัปเดต booking
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: {
        paymentSlip: slipResult.secure_url,
        paymentStatus: "pending",
      },
    });

    res.json({
      success: true,
      message: "อัปโหลดสลิปการโอนเงินสำเร็จ รอการตรวจสอบ",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Upload payment slip error:", error);
    handleError(res, error);
  }
};

// ยืนยันการชำระเงิน (สำหรับ admin)
const confirmPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userRole = req.user.role;

    if (userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์ดำเนินการนี้",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: {
        paymentStatus: "paid",
        status: "confirmed",
      },
      include: {
        User: true,
        Place: true,
        Room: true,
      },
    });

    res.json({
      success: true,
      message: "ยืนยันการชำระเงินสำเร็จ",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    handleError(res, error);
  }
};

// ปฏิเสธการชำระเงิน (สำหรับ admin)
const rejectPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    const userRole = req.user.role;

    if (userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "คุณไม่มีสิทธิ์ดำเนินการนี้",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: {
        paymentStatus: "rejected",
        status: "cancelled",
        // สามารถเพิ่มฟิลด์ reason ได้ถ้าต้องการ
      },
      include: {
        User: true,
        Place: true,
        Room: true,
      },
    });

    res.json({
      success: true,
      message: "ปฏิเสธการชำระเงินสำเร็จ",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Reject payment error:", error);
    handleError(res, error);
  }
};

// ดึงรายการการจองที่รอการยืนยันการชำระเงิน
const getPendingPayments = async (req, res) => {
  try {
    // ปิดการตรวจสอบ role ชั่วคราวเพื่อทดสอบ
    // const userRole = req.user.role;
    // if (userRole !== "ADMIN" && userRole !== "BUSINESS") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้",
    //   });
    // }

    const pendingBookings = await prisma.booking.findMany({
      where: {
        paymentStatus: "pending",
        paymentSlip: {
          not: null,
        },
      },
      include: {
        User: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        Place: {
          select: {
            id: true,
            title: true,
            secure_url: true,
          },
        },
        Room: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: pendingBookings,
    });
  } catch (error) {
    console.error("Get pending payments error:", error);
    handleError(res, error);
  }
};

// ดึงรายการการจองทั้งหมดพร้อมสถานะการชำระเงิน
const getAllBookingsWithPayment = async (req, res) => {
  try {
    // ปิดการตรวจสอบ role ชั่วคราวเพื่อทดสอบ
    // const userRole = req.user.role;
    // if (userRole !== "ADMIN" && userRole !== "BUSINESS") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้",
    //   });
    // }

    const bookings = await prisma.booking.findMany({
      include: {
        User: {
          select: {
            id: true,
            username: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        Place: {
          select: {
            id: true,
            title: true,
            secure_url: true,
          },
        },
        Room: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    handleError(res, error);
  }
};

module.exports = {
  uploadPaymentInfo,
  getPaymentInfo,
  updatePaymentInfo,
  deletePaymentInfo,
  uploadPaymentSlip,
  confirmPayment,
  rejectPayment,
  getPendingPayments,
  getAllBookingsWithPayment,
};
