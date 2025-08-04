const express = require("express");
const {
  uploadPaymentInfo,
  getPaymentInfo,
  updatePaymentInfo,
  deletePaymentInfo,
  uploadPaymentSlip,
  confirmPayment,
  rejectPayment,
  getPendingPayments,
  getAllBookingsWithPayment,
} = require("../controllers/payment");
const { authCheck } = require("../middleware/authCheck");
const { upload, handleMulterError } = require("../middleware/upload");

const router = express.Router();

// Routes สำหรับผู้ประกอบการ
router.post(
  "/upload-info",
  authCheck,
  upload.single("qrCode"),
  uploadPaymentInfo
);
router.get("/info/:placeId", authCheck, getPaymentInfo);
router.put(
  "/update/:placeId",
  authCheck,
  upload.single("qrCode"),
  updatePaymentInfo
);
router.delete("/delete/:placeId", authCheck, deletePaymentInfo);

// Routes สำหรับลูกค้า
router.post(
  "/upload-slip/:bookingId",
  authCheck,
  upload.single("paymentSlip"),
  uploadPaymentSlip
);

// Routes สำหรับ admin
router.put("/confirm/:bookingId", authCheck, confirmPayment);
router.put("/reject/:bookingId", authCheck, rejectPayment);
router.get("/pending", authCheck, getPendingPayments);
router.get("/bookings", authCheck, getAllBookingsWithPayment);

// Error handler for multer
router.use(handleMulterError);

module.exports = router;
