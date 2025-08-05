const express = require("express");
const {
  createBooking,
  createBankTransferBooking,
  cancelBooking,
  checkout,
  checkOutStatus,
  listBookings,
  clearRoomBookings,
  processAutomaticCheckout,
  manualCheckout,
} = require("../controllers/booking");
const { authCheck } = require("../middleware/authCheck");
const router = express.Router();

// @ENDPOINT http://localhost:5000/api/bookings
router.get("/bookings", authCheck, listBookings);

// @ENDPOINT http://localhost:5000/api/booking
router.post("/booking", authCheck, createBooking);

// @ENDPOINT http://localhost:5000/api/booking/bank-transfer
router.post("/booking/bank-transfer", authCheck, createBankTransferBooking);

// @PAYMENT
// @ENDPOINT http://localhost:5000/api/checkout
router.post("/checkout", authCheck, checkout);

// @PAYMENT Status
// @ENDPOINT http://localhost:5000/api/checkout-status/:session_id
router.get("/checkout-status/:session_id", authCheck, checkOutStatus);

// @CLEAR ROOM BOOKINGS (Admin only)
// @ENDPOINT http://localhost:5000/api/booking/clear-room/:roomId
router.delete("/booking/clear-room/:roomId", authCheck, clearRoomBookings);

// @CANCEL BOOKING
// @ENDPOINT http://localhost:5000/api/booking/cancel/:bookingId
router.put("/booking/cancel/:bookingId", authCheck, cancelBooking);

// @PROCESS AUTOMATIC CHECKOUT (Admin only)
// @ENDPOINT http://localhost:5000/api/booking/process-checkout
router.post("/booking/process-checkout", authCheck, processAutomaticCheckout);

// @MANUAL CHECKOUT (Admin only)
// @ENDPOINT http://localhost:5000/api/booking/checkout/:bookingId
router.put("/booking/checkout/:bookingId", authCheck, manualCheckout);

module.exports = router;
